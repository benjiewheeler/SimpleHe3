import { useContext, useEffect, useState } from "react";
import { SignTransactionResponse } from "universal-authenticator-library";
import { AppCtx, BLOCKCHAIN, BUILDING_SCHEMAS, MACHINE_SCHEMAS, RARITIES } from "../constants";
import { AtomicAsset, ContractAsset } from "../types";
import { fetchPlayerAssets, fetchPlayerTools, setStorageItem } from "../utils";
import _ from "lodash";

export function Inventory(): JSX.Element {
	const { ual, waxEndpoint, atomicEndpoint, refreshNonce } = useContext(AppCtx);
	const [buildings, setBuildings] = useState<AtomicAsset[]>([]);
	const [machines, setMachines] = useState<AtomicAsset[]>([]);
	const [usedTools, setUsedTools] = useState<ContractAsset[]>([]);

	useEffect(() => {
		if (ual.activeUser) refresh();
	}, [ual.activeUser, refreshNonce]);

	const refresh = async () => {
		const tools = await fetchPlayerTools(ual.activeUser.accountName, waxEndpoint);
		setUsedTools(tools);

		const assets = await fetchPlayerAssets(ual.activeUser.accountName, atomicEndpoint);
		setBuildings(assets.filter(a => BUILDING_SCHEMAS.includes(a.schema_name)));
		setMachines(assets.filter(a => MACHINE_SCHEMAS.includes(a.schema_name)));
	};

	const installMachine = async (asset: AtomicAsset): Promise<void> => {
		const res: SignTransactionResponse | Error = await ual.activeUser
			.signTransaction(
				{
					actions: [
						{
							account: BLOCKCHAIN.DAPP_CONTRACT,
							name: "regmch",
							authorization: [{ actor: ual.activeUser.accountName, permission: ual.activeUser.requestPermission }],
							data: { asset_ids: [asset.asset_id], player: ual.activeUser.accountName },
						},
					],
				},
				{ broadcast: true, blocksBehind: 3, expireSeconds: 1800 }
			)
			.then(res => res)
			.catch(error => error);

		if (res instanceof Error) {
			// showPopup("error", res.message);
			alert(res.message);
		} else {
			// showPopup("success", "Asset removed successfully");
			alert("Asset installed successfully");
			setStorageItem(`tools.${ual.activeUser?.accountName}`, null, -1);
			setStorageItem(`assets.${ual.activeUser?.accountName}`, null, -1);
			refresh();
		}
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
							{_(tools)
								.orderBy(
									[a => usedTools.find(t => t.asset_id == a.asset_id), a => RARITIES[a.rarity], "name", "mint"],
									["desc", "desc", "asc", "asc"]
								)
								.value()
								.map(a => (
									<div key={a.asset_id} className="flex flex-col rounded p-1 m-1 border border-slate-700">
										<div className="flex flex-col relative">
											<span className="absolute text-xs text-white bg-black font-mono border border-neutral-600 rounded p-1">
												#{a.mint}
											</span>
											<img
												className="max-w-none w-36"
												src={`https://ipfs.hivebp.io/thumbnail?hash=${a.img}`}
												alt={a.name}
											/>
											<span className="text-center text-sm text-white">{a.name}</span>
											<div className="flex flex-row justify-evenly mt-1">
												<button
													onClick={() => installMachine(a)}
													disabled={!!usedTools.find(t => t.asset_id == a.asset_id)}
													className="disabled:text-gray-800 disabled:cursor-not-allowed flex-1 my-1 mr-1 p-0.5 text-gray-400 text-xs self-center rounded bg-slate-900 hover:bg-gray-700"
												>
													Install
												</button>
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
