import { Wax as WCW } from "@eosdacio/ual-wax";
import React from "react";
import { Anchor } from "ual-anchor";
import { UAL } from "./types";
import { getStorageItem } from "./utils";

export const ENDPOINTS = {
	ATOMIC: [
		"atomic.3dkrender.com",
		"wax.api.atomicassets.io",
		"api.wax-aa.bountyblok.io",
		"aa.dapplica.io",
		"wax-aa.eu.eosamsterdam.net",
		"aa-api-wax.eosauthority.com",
		"wax-aa.eosdublin.io",
		"wax-atomic.eosiomadrid.io",
		"wax-atomic-api.eosphere.io",
		"atomic.wax.eosrio.io",
		"api.atomic.greeneosio.com",
		"atomic.hivebp.io",
		"atomic.ledgerwise.io",
		"api.wax.liquidstudios.io",
		"atomic.tokengamer.io",
		"wax-atomic.wizardsguild.one",
	],
	API: [
		"apiwax.3dkrender.com",
		"api.wax.alohaeos.com",
		"wax.blacklusion.io",
		"wax.blokcrafters.io",
		"wax.cryptolions.io",
		"wax.dapplica.io",
		"wax.eu.eosamsterdam.net",
		"api-wax.eosauthority.com",
		"wax.eosdac.io",
		"api.wax.eosdetroit.io",
		"wax.eosdublin.io",
		"wax.eoseoul.io",
		"wax.eosn.io",
		"wax.eosphere.io",
		"api.wax.greeneosio.com",
		"wax.greymass.com",
		"api.hivebp.io",
		"waxapi.ledgerwise.io",
		"api.wax.liquidstudios.io",
		"wax.pink.gg",
		"api.waxsweden.org",
		"wax-bp.wizardsguild.one",
	],
};

export const RARITIES = { Metal: 1, Jadeite: 2, Silver: 3, Gold: 4, Helium: 5 };

export const BUILDING_SCHEMAS = ["buildingphoe", "buildingaqua", "buildingterr", "buildingpega", "syndicatef2p"];
export const MACHINE_SCHEMAS = ["machinephoe", "machineaqua", "machineterra", "machinepegas", "syndicatmf2p", "thebarcrimes"];

export interface AppContextInterface {
	ual: UAL;

	waxEndpoint: string;
	setWAXEndpoint: (endpoint: string) => void;

	atomicEndpoint: string;
	setAtomicEndpoint: (endpoint: string) => void;

	refreshNonce: number;
	forceRefresh: (nonce: number) => void;

	alertColor: string;
	alertMessage: string;

	setAlert: (message: string, color: string) => void;
}

export const AppCtx = React.createContext<AppContextInterface>(null);

export const DAPP_NAME = "simplehe3";

export const WAX_CHAIN = {
	chainId: "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
	rpcEndpoints: [{ protocol: "https", host: getStorageItem<string>("wax_endpoint", ENDPOINTS.API[0]), port: 443 }],
};

export const BLOCKCHAIN = {
	DAPP_CONTRACT: "moonmhe3game",
	AA_COLLECTION: "moonminingh3",
	TOKEN_CONTRACT: "moonmhe3tokn",
	TOKEN_SYMBOL: "HEL",
	AUTHENTICATORS: [new Anchor([WAX_CHAIN], { appName: DAPP_NAME }), new WCW([WAX_CHAIN], {})],
};
