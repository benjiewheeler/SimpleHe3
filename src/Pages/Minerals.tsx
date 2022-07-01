import { useContext, useEffect, useState } from "react";
import { SignTransactionResponse } from "universal-authenticator-library";
import { Loader } from "../Components/Loader";
import { AppCtx, BLOCKCHAIN } from "../constants";
import { Mineral, ShopConfig, Token } from "../types";
import {
	adjustTokenSymbol,
	fetchPlayerBalances,
	fetchPlayerMinerals,
	fetchShopConfigs,
	fetchTemplates,
	formatTokenDisplay,
	setStorageItem,
} from "../utils";

export function Minerals(): JSX.Element {
	const { ual, atomicEndpoint, waxEndpoint } = useContext(AppCtx);
	const [accountBalances, setAccountBalances] = useState<Token[]>(null);
	const [balances, setBalances] = useState<Token[]>([]);
	const [minerals, setMinerals] = useState<Mineral[]>([]);
	const [shopItems, setShopItems] = useState<ShopConfig[]>([]);

	useEffect(() => {
		if (ual.activeUser) fetchData();
	}, []);

	const fetchData = async () => {
		const templates = await fetchTemplates(atomicEndpoint);
		const minerals = await fetchPlayerMinerals(ual.activeUser.accountName, atomicEndpoint);

		setMinerals(
			minerals.map(mineral => ({
				...templates.find(template => template.template_id == mineral.template_id),
				...mineral,
			}))
		);

		const balanceList = await fetchPlayerBalances(ual.activeUser.accountName, waxEndpoint);
		setAccountBalances(balanceList);
		setBalances(balanceList.map(tok => ({ ...tok, amount: 0 })));

		const shopListings = await fetchShopConfigs(waxEndpoint);
		setShopItems(shopListings);
	};

	const updateBalance = (index: number, amount: number) => {
		const bals = [...balances];
		bals[index].amount = Math.floor(amount / 100) * 100;

		setBalances(bals);
	};

	const burnMineral = async (mineral: Mineral): Promise<void> => {
		const res: SignTransactionResponse | Error = await ual.activeUser
			.signTransaction(
				{
					actions: [
						{
							account: "atomicassets",
							name: "burnasset",
							authorization: [{ actor: ual.activeUser.accountName, permission: ual.activeUser.requestPermission }],
							data: { asset_id: mineral.asset_id, asset_owner: ual.activeUser.accountName },
						},
					],
				},
				{ broadcast: true, blocksBehind: 3, expireSeconds: 1800 }
			)
			.then(res => res)
			.catch(error => error);

		if (res instanceof Error) {
			alert(res.message);
		} else {
			alert("Mineral burned successfully");
			setStorageItem(`minerals.${ual.activeUser?.accountName}`, null, -1);
			fetchData();
		}
	};

	const mintMineral = async (token: Token): Promise<void> => {
		const res: SignTransactionResponse | Error = await ual.activeUser
			.signTransaction(
				{
					actions: [
						{
							account: BLOCKCHAIN.DAPP_CONTRACT,
							name: "buyshopl",
							authorization: [{ actor: ual.activeUser.accountName, permission: ual.activeUser.requestPermission }],
							data: {
								player: ual.activeUser.accountName,
								id: shopItems.find(item => item.price.symbol == token.symbol).template_id,
								quantity: Number(balances.find(b => b.symbol == token.symbol).amount) / 100,
							},
						},
					],
				},
				{ broadcast: true, blocksBehind: 3, expireSeconds: 1800 }
			)
			.then(res => res)
			.catch(error => error);

		if (res instanceof Error) {
			alert(res.message);
		} else {
			alert("Mineral minted successfully");
			setStorageItem(`minerals.${ual.activeUser?.accountName}`, null, -1);
			fetchData();
		}
	};

	if (!shopItems?.length)
		return (
			<div className="flex flex-col flex-grow h-full w-full p-4 text-center">
				<Loader />
			</div>
		);

	return (
		<>
			<div className="flex flex-col">
				<div className="flex flex-col">
					<h1 className="text-center text-xl font-bold text-white p-2">Minerals</h1>
					<div className="flex flex-row flex-wrap justify-center">
						{minerals.map(m => (
							<div key={m.asset_id} className="flex flex-col rounded p-1 m-1 border border-slate-700">
								<div className="flex flex-col relative">
									<span className="absolute text-xs text-white bg-black font-mono border border-neutral-600 rounded p-1">
										#{m.mint}
									</span>
									<img className="max-w-none w-36" src={`https://ipfs.hivebp.io/thumbnail?hash=${m.img}`} alt={m.name} />
									<span className="text-center text-sm text-white">{m.name}</span>
									<div className="flex flex-row justify-evenly mt-1">
										<button
											onClick={() => burnMineral(m)}
											className="flex-1 my-1 p-0.5 text-gray-400 text-xs self-center rounded bg-slate-900 hover:bg-red-900"
										>
											Burn
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="flex flex-col">
					<h1 className="text-center text-xl font-bold text-white p-2">Resources</h1>
					<div className="flex flex-row flex-wrap justify-center">
						{accountBalances.map((tok, i) => (
							<div key={`res-tok-${i}`} className="flex flex-col mb-2 px-1">
								<span className="text-xs text-white py-1 cursor-pointer" onClick={() => updateBalance(i, Number(tok.amount))}>
									{tok.symbol} ({formatTokenDisplay(adjustTokenSymbol(tok))})
								</span>
								<input
									type="number"
									min={0}
									max={tok.amount}
									step={100}
									value={balances[i]?.amount}
									onChange={e => updateBalance(i, parseFloat(e.target.value))}
									className="text-sm bg-transparent text-white border border-gray-700 rounded outline-none p-1"
								/>
								<div className="flex flex-row justify-evenly mt-1">
									<button
										onClick={() => mintMineral(tok)}
										disabled={tok.amount < 100}
										className="disabled:text-gray-800 disabled:cursor-not-allowed flex-1 my-1 px-0.5 py-2 text-gray-400 text-sm rounded bg-slate-900 hover:bg-gray-700"
									>
										Mint
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
