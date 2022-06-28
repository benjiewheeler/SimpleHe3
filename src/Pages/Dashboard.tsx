import Countdown from "react-countdown";
import { useContext, useEffect, useState } from "react";
import { AppCtx, RARITIES } from "../constants";
import { AssetTemplate, Token, Tool } from "../types";
import { adjustTokenSymbol, fetchPlayerTools, fetchTemplates, fetchToolConfigs, formatTokenDisplay, parseToken } from "../utils";

export function Dashboard(): JSX.Element {
	const { ual, waxEndpoint, atomicEndpoint } = useContext(AppCtx);
	const [buildings, setBuildings] = useState<Tool[]>([]);
	const [machines, setMachines] = useState<Tool[]>([]);

	useEffect(() => {
		if (ual.activeUser) refresh();
	}, [ual.activeUser]);

	const refresh = async () => {
		const templates = await fetchTemplates(atomicEndpoint);
		const tools = await fetchPlayerTools(ual.activeUser.accountName, waxEndpoint);
		const toolConfigs = await fetchToolConfigs(waxEndpoint);

		const buildingTemplates = templates
			.filter(t => ["buildingphoe", "buildingaqua", "buildingterr", "buildingpega"].includes(t.schema_name))
			.map(t => Number(t.template_id));

		const machineTemplates = templates
			.filter(t => ["machinephoe", "machineaqua", "machineterra"].includes(t.schema_name))
			.map(t => Number(t.template_id));

		setBuildings(
			tools
				.filter(t => buildingTemplates.includes(t.template_id))
				.map(tool => ({
					...templates.find(template => template.template_id == tool.template_id),
					...toolConfigs.find(conf => conf.template_id == tool.template_id),
					...tool,
				}))
		);
		setMachines(
			tools
				.filter(t => machineTemplates.includes(t.template_id))
				.map(tool => ({
					...templates.find(template => template.template_id == tool.template_id),
					...toolConfigs.find(conf => conf.template_id == tool.template_id),
					...tool,
				}))
		);

		console.log({ machines });
		console.log({ buildings });
	};

	const needsRefuel = (tool: Tool): boolean => {
		const inputs = tool.token_input.map(tok => parseToken(tok));
		const reserve = tool.token_reserve.map(tok => parseToken(tok));

		const isFueled = inputs.every(inp => (reserve.find(res => inp.symbol == res.symbol)?.amount || 0) >= inp.amount);
		return !isFueled;
	};

	return (
		<>
			<div className="flex flex-col">
				{[
					{ tools: buildings, name: "Buildings" },
					{ tools: machines, name: "Machines" },
				].map(({ tools, name }) => (
					<div key={name} className="flex flex-col">
						<h1 className="text-center text-xl font-bold text-white p-2">{name}</h1>
						<div className="flex flex-row flex-wrap justify-center">
							{tools
								.sort((a, b) => RARITIES[a.rarity] - RARITIES[b.rarity])
								.map(t => (
									<div key={t.asset_id} className="flex flex-col rounded p-1 m-1 border border-slate-700">
										<div className="flex flex-col relative">
											<Countdown
												className="absolute text-xs text-white bg-black font-mono border border-neutral-600 rounded p-1"
												date={(t.last_claim + t.delay) * 1e3}
												daysInHours
											/>
											<img
												className="max-w-none w-36"
												src={`https://ipfs.hivebp.io/thumbnail?hash=${t.img}`}
												alt={t.name}
											/>
											<span className="text-center text-sm text-white">{t.name}</span>
											<div className="flex flex-row justify-evenly mt-1">
												<button className="flex-1 my-1 mr-1 p-0.5 text-gray-400 text-xs self-center rounded bg-slate-900 hover:bg-red-900">
													Remove
												</button>
												<button
													disabled={!t.token_input.length}
													className="disabled:text-gray-800 disabled:cursor-not-allowed flex-1 my-1 ml-1 p-0.5 text-gray-400 text-xs self-center rounded bg-slate-900 hover:bg-gray-700"
												>
													Fuel
												</button>
											</div>
										</div>
										<div className="flex flex-col">
											<div className={`flex flex-row text-white justify-around`}>
												{t.token_input
													.map(output => parseToken(output))
													.map(tok => ({
														inp: tok,
														res: t.token_reserve.map(t => parseToken(t)).find(t => t.symbol == tok.symbol),
													}))
													.map(({ inp, res }, i) => (
														<span
															key={`${t.asset_id}-${i}`}
															className={`mx-0.5 p-1 text-xs rounded ${
																needsRefuel(t) ? "bg-red-900" : "bg-lime-800"
															}`}
														>
															{formatTokenDisplay(
																adjustTokenSymbol({
																	amount: `${res.amount} / ${inp.amount}`,
																	symbol: res.symbol,
																})
															)}
														</span>
													))}
											</div>
										</div>
									</div>
								))}
						</div>
					</div>
				))}
			</div>
		</>
	);
}
