import React, { useContext } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { AppCtx, ENDPOINTS } from "../constants";
import { setStorageItem } from "../utils";

export function TopBar() {
	const { ual, waxEndpoint, setWAXEndpoint, atomicEndpoint, setAtomicEndpoint } = useContext(AppCtx);
	const routerMatch = useRouteMatch(["/dashboard", "/minerals"]);

	const saveWAXEndpoint = async (endpoint: string) => {
		setWAXEndpoint(endpoint);
		setStorageItem<string>("wax_endpoint", endpoint, 0);

		setStorageItem(`tools.${ual.activeUser?.accountName}`, null, -1);
		setStorageItem(`toolconfigs.${ual.activeUser?.accountName}`, null, -1);

		location.reload();
	};

	const saveAtomicEndpoint = async (endpoint: string) => {
		setAtomicEndpoint(endpoint);
		setStorageItem<string>("atomic_endpoint", endpoint, 0);

		setStorageItem(`templates.${ual.activeUser?.accountName}`, null, -1);
		setStorageItem(`minerals.${ual.activeUser?.accountName}`, null, -1);

		location.reload();
	};

	return (
		<div className="bg-gray-700 flex flex-col">
			<div className="p-2 flex flex-row flex-wrap">
				<div className="flex flex-col justify-center mr-1">
					<span className="text-white text-xl font-bold">SimpleHe3</span>
				</div>
				<div className="flex flex-row flex-grow self-center justify-center mx-1">
					<span className="text-white text-sm">{ual?.activeUser?.accountName}</span>
				</div>

				<div className="flex flex-col mx-1">
					<select
						className="bg-transparent border border-gray-500 rounded text-gray-400 text-xs font-mono mb-1"
						value={waxEndpoint}
						onChange={e => saveWAXEndpoint(e.target.value)}
					>
						{ENDPOINTS.API.map(endpoint => (
							<option className="text-black" key={endpoint} value={endpoint}>
								{endpoint}
							</option>
						))}
					</select>
					<select
						className="bg-transparent border border-gray-500 rounded text-gray-400 text-xs font-mono"
						value={atomicEndpoint}
						onChange={e => saveAtomicEndpoint(e.target.value)}
					>
						{ENDPOINTS.ATOMIC.map(endpoint => (
							<option className="text-black" key={endpoint} value={endpoint}>
								{endpoint}
							</option>
						))}
					</select>
				</div>
				<div className="flex flex-row ml-1">
					{!ual.activeUser && (
						<button
							className="text-sm text-black bg-yellow-600 p-1 rounded hover:bg-yellow-800 hover:text-white"
							onClick={() => ual.showModal()}
						>
							Login
						</button>
					)}
					{ual.activeUser && (
						<button
							className="text-sm text-black bg-slate-600 p-1 rounded hover:bg-slate-800 hover:text-white"
							onClick={() => ual.logout()}
						>
							Logout
						</button>
					)}
				</div>
			</div>
			{ual?.activeUser && (
				<div className="flex flex-row flex-wrap">
					<Link
						className={`mx-0.5 py-1 px-2 text-gray-400 hover:bg-gray-900 ${
							routerMatch?.path == "/dashboard" ? "bg-slate-800" : ""
						}`}
						to={"/dashboard"}
					>
						Dashboard
					</Link>
					<Link
						className={`mx-0.5 py-1 px-2 text-gray-400 hover:bg-gray-900 ${routerMatch?.path == "/minerals" ? "bg-slate-800" : ""}`}
						to={"/minerals"}
					>
						Minerals
					</Link>
				</div>
			)}
		</div>
	);
}
