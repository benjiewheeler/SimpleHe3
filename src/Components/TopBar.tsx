import React, { useContext } from "react";
import { AppCtx, ENDPOINTS } from "../constants";

export function TopBar() {
	const { ual, waxEndpoint, setWAXEndpoint, atomicEndpoint, setAtomicEndpoint } = useContext(AppCtx);

	return (
		<div className="p-2 bg-gray-700 flex flex-row flex-wrap">
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
					onChange={e => setWAXEndpoint(e.target.value)}
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
					onChange={e => setAtomicEndpoint(e.target.value)}
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
	);
}
