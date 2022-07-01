import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SignTransactionResponse } from "universal-authenticator-library";
import { Loader } from "../Components/Loader";
import { AppCtx, BLOCKCHAIN } from "../constants";
import { Token, Tool } from "../types";
import {
	adjustTokenSymbol,
	fetchPlayerBalances,
	fetchPlayerTools,
	fetchTemplates,
	fetchToolConfigs,
	formatTokenContract,
	formatTokenDisplay,
	parseToken,
	setStorageItem,
} from "../utils";

export function Fuel(props: { asset: string }): JSX.Element {
	const { ual, waxEndpoint, atomicEndpoint, forceRefresh, setAlert } = useContext(AppCtx);
	const [accountBalances, setAccountBalances] = useState<Token[]>(null);
	const [balances, setBalances] = useState<Record<string, Token>>({});
	const [tool, setTool] = useState<Tool>(null);
	const history = useHistory();

	useEffect(() => {
		if (ual.activeUser) fetchData();
	}, []);

	const fetchData = async () => {
		const templates = await fetchTemplates(atomicEndpoint);
		const tools = await fetchPlayerTools(ual.activeUser.accountName, waxEndpoint);
		const toolConfigs = await fetchToolConfigs(waxEndpoint);

		const tool = tools.find(t => t.asset_id == props.asset);

		setTool({
			...templates.find(template => template.template_id == tool.template_id),
			...toolConfigs.find(conf => conf.template_id == tool.template_id),
			...tool,
		});

		const balanceList = await fetchPlayerBalances(ual.activeUser.accountName, waxEndpoint);
		setAccountBalances(balanceList);
		setBalances(
			_(balanceList)
				.map(tok => [tok.symbol, { ...tok, amount: 0 }])
				.fromPairs()
				.value()
		);
	};

	const updateBalance = (symbol: string, amount: number) => {
		setBalances(prev => {
			prev[symbol] = { ...prev[symbol], amount };
			return prev;
		});
	};

	const performAction = async (name: string, tool: Tool, quantities: Token[]): Promise<boolean> => {
		const res: SignTransactionResponse | Error = await ual.activeUser
			.signTransaction(
				{
					actions: [
						{
							account: BLOCKCHAIN.DAPP_CONTRACT,
							name,
							authorization: [{ actor: ual.activeUser.accountName, permission: ual.activeUser.requestPermission }],
							data: {
								player: ual.activeUser.accountName,
								asset_id: tool.asset_id,
								quantitys: quantities.filter(tok => tok.amount > 0).map(tok => formatTokenContract(tok)),
							},
						},
					],
				},
				{ broadcast: true, blocksBehind: 3, expireSeconds: 1800 }
			)
			.then(res => res)
			.catch(error => error);

		if (res instanceof Error) {
			setAlert(res.message, "red-900");
			return false;
		} else {
			return true;
		}
	};

	const depositAssets = async (tool: Tool, quantities: Token[]): Promise<void> => {
		if (!quantities.filter(tok => tok.amount > 0).length) {
			setAlert("You must deposit at least 1 resource", "red-900");
			return;
		}

		const success = await performAction("deposittkn", tool, quantities);

		if (success) {
			setAlert("Tokens deposited successfully", "lime-800");
			setStorageItem(`tools.${ual.activeUser?.accountName}`, null, -1);

			history.push("/dashboard");
			forceRefresh(Math.random());
		}
	};

	const withdrawAssets = async (tool: Tool, quantities: Token[]): Promise<void> => {
		if (!quantities.filter(tok => tok.amount > 0).length) {
			setAlert("You must withdraw at least 1 resource", "red-900");
			return;
		}

		const success = await performAction("withdraw", tool, quantities);

		if (success) {
			setAlert("Tokens withdrawn successfully", "lime-800");
			setStorageItem(`tools.${ual.activeUser?.accountName}`, null, -1);

			history.push("/dashboard");
			forceRefresh(Math.random());
		}
	};

	if (!accountBalances || !tool)
		return (
			<div className="flex flex-col flex-grow h-full w-full p-4 text-center">
				<Loader />
			</div>
		);

	return (
		<>
			<div className="flex flex-row flex-wrap flex-grow p-4">
				<div className="flex flex-col p-4">
					<img className="max-w-none" src={`https://ipfs.hivebp.io/thumbnail?hash=${tool.img}`} alt={tool.name} />
					<span className="text-center text-sm text-white">{tool.name}</span>

					<div className="flex flex-col">
						<div className={`flex flex-row text-white justify-around`}>
							{tool.token_input
								.map(output => parseToken(output))
								.map(tok => ({
									inp: tok,
									res: tool.token_reserve.map(t => parseToken(t)).find(t => t.symbol == tok.symbol),
								}))
								.map(({ inp, res }, i) => (
									<span
										key={`${tool.asset_id}-${i}`}
										className={`mx-0.5 p-1 text-xs rounded ${res.amount < inp.amount ? "bg-red-900" : "bg-lime-800"}`}
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

				<div className="flex flex-col p-4">
					<div className="flex flex-col p-4">
						{accountBalances
							.filter(tok => tool.token_input.map(output => parseToken(output)).find(inp => inp.symbol == tok.symbol))
							.map((tok, i) => (
								<div key={`fuel-tok-${tok.symbol}`} className="flex flex-col mb-2">
									<span
										className="text-xs text-white py-1 cursor-pointer"
										onClick={() => updateBalance(tok.symbol, Number(tok.amount))}
									>
										{tok.symbol} ({formatTokenDisplay(adjustTokenSymbol(tok))})
									</span>
									<input
										type="number"
										min={0}
										max={tok.amount}
										step={1}
										value={balances[i]?.amount}
										onChange={e => updateBalance(tok.symbol, parseFloat(e.target.value))}
										className="text-sm bg-transparent text-white border border-gray-700 rounded outline-none p-1"
									/>
								</div>
							))}
					</div>
					<div className="flex flex-row p-4">
						<button
							onClick={() => depositAssets(tool, Object.values(balances))}
							className="mx-0.5 flex-1 p-2 text-gray-400 text-sm rounded bg-slate-900 hover:bg-gray-700"
						>
							Deposit
						</button>
						<button
							disabled
							onClick={() => withdrawAssets(tool, Object.values(balances))}
							className="disabled:text-gray-800 disabled:cursor-not-allowed mx-0.5 flex-1 p-2 text-gray-400 text-sm rounded bg-slate-900 hover:bg-gray-700"
						>
							Withdraw
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
