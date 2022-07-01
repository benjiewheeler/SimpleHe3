import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, MemoryRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import "regenerator-runtime/runtime";
import { UALProvider, withUAL } from "ual-reactjs-renderer";
import { Alert } from "./Components/Alert";
import { TopBar } from "./Components/TopBar";
import { AppCtx, BLOCKCHAIN, DAPP_NAME, ENDPOINTS, WAX_CHAIN } from "./constants";
import "./index.css";
import { Dashboard } from "./Pages/Dashboard";
import { Fuel } from "./Pages/Fuel";
import { Inventory } from "./Pages/Inventory";
import { Login } from "./Pages/Login";
import { Minerals } from "./Pages/Minerals";
import { UAL } from "./types";
import { getStorageItem } from "./utils";

function SimpleHe3(): JSX.Element {
	const { ual, alertColor, alertMessage } = useContext(AppCtx);

	return (
		<>
			<Alert color={alertColor} message={alertMessage} />

			<BrowserRouter>
				<TopBar />

				<Switch>
					<Route path="/dashboard" render={() => <Dashboard />} />
					<Route path="/login" render={() => <Login />} />
					<Route path="/fuel/:asset" render={props => <Fuel asset={props.match.params.asset} />} />
					<Route path="/minerals" render={() => <Minerals />} />
					<Route path="/inventory" render={() => <Inventory />} />
				</Switch>

				{!ual.activeUser && <Redirect to="/login" />}
				{ual.activeUser && <Redirect to="/dashboard" />}
			</BrowserRouter>
		</>
	);
}

export default function App(props: React.PropsWithChildren<{ ual?: UAL }>): JSX.Element {
	const [waxEndpoint, setWAXEndpoint] = useState<string>(getStorageItem<string>("wax_endpoint", ENDPOINTS.API[0]));
	const [atomicEndpoint, setAtomicEndpoint] = useState<string>(getStorageItem<string>("atomic_endpoint", ENDPOINTS.ATOMIC[0]));
	const [refreshNonce, forceRefresh] = useState<number>(Math.random());
	const [alertColor, setAlertColor] = useState<string>(null);
	const [alertMessage, setAlertMessage] = useState<string>(null);

	const setAlert = (message: string, color: string) => {
		setAlertMessage(message);
		setAlertColor(color);

		setTimeout(() => setAlertMessage(null), 5e3);
	};

	return (
		<AppCtx.Provider
			value={{
				ual: props.ual,
				waxEndpoint,
				setWAXEndpoint,
				atomicEndpoint,
				setAtomicEndpoint,
				refreshNonce,
				forceRefresh,
				alertColor,
				alertMessage,
				setAlert,
			}}
		>
			{props.children}
		</AppCtx.Provider>
	);
}

const AlienRumbleXUAL = withUAL(App);

ReactDOM.render(
	<UALProvider chains={[WAX_CHAIN]} authenticators={BLOCKCHAIN.AUTHENTICATORS} appName={DAPP_NAME}>
		<AlienRumbleXUAL>
			<AppCtx.Consumer>
				{() => (
					<Router>
						<SimpleHe3 />
					</Router>
				)}
			</AppCtx.Consumer>
		</AlienRumbleXUAL>
	</UALProvider>,
	document.getElementById("root")
);
