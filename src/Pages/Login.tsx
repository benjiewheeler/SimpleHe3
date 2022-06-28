import { useContext } from "react";
import { AppCtx } from "../constants";

export function Login(): JSX.Element {
	const { ual } = useContext(AppCtx);

	return (
		<>
			<div className="flex flex-col flex-grow h-full w-full p-4 text-center">
				<span className="text-white text-base">Please Login</span>
			</div>
		</>
	);
}
