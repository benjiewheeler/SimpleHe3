import { useContext } from "react";
import { AppCtx } from "../constants";

export function Login(): JSX.Element {
	const { ual } = useContext(AppCtx);

	return (
		<>
			<div className="flex flex-col flex-grow h-full w-full p-4 text-center">
				<span className="my-6 text-white text-base self-center">Please Login</span>

				<div className="flex flex-col mt-6 text-gray-400 border self-center p-4 rounded-xl border-slate-700 max-w-lg">
					<span className="text-base font-bold text-yellow-500 mb-1 animate-pulse">Reminder</span>
					<p className="text-sm my-2">
						This website is <span className="font-bold">NOT</span> the official UI of{" "}
						<a className="text-violet-600" href="https://mmhe3.io/" target="_blank" rel="nofollow">
							Moon Mining He3 &#x1F855;
						</a>
					</p>
					<p className="text-sm my-2">
						This website is developed by <span className="font-bold text-indigo-500">Benjie#5458</span> for personal use (on mobile), and is not affiliated with Moon Mining He3
					</p>
					<p className="text-sm my-2">Not all the features of MMHe3 might be implemented, You'll have to use the official UI</p>
					<p className="text-sm my-2">
						This website is hosted for free, but if you want to buy me a{" "}
						<a className="italic text-blue-600" target="_blank" rel="nofollow" href="https://wax.bloks.io/account/benjiewaxbag">
							coffee
						</a>{" "}
						I wouldn't stop you ;)
					</p>
					<p className="text-sm my-2">
						Happy Mining
					</p>
				</div>
			</div>
		</>
	);
}
