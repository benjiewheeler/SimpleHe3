import { Wax as WCW } from "@eosdacio/ual-wax";
import React from "react";
import { Anchor } from "ual-anchor";
import { UAL } from "./types";

export const ENDPOINTS = {
	ATOMIC: [
		"wax.api.atomicassets.io",
		"aa-api-wax.eosauthority.com",
		"aa.dapplica.io",
		"api-wax-aa.eosarabia.net",
		"api.atomic.greeneosio.com",
		"api.wax-aa.bountyblok.io",
		"api.wax.liquidstudios.io",
		"atomic.3dkrender.com",
		"atomic.hivebp.io",
		"atomic.ledgerwise.io",
		"atomic.tokengamer.io",
		"atomic.wax.eosrio.io",
		"wax-aa.eosdublin.io",
		"wax-aa.eu.eosamsterdam.net",
		"wax-atomic-api.eosphere.io",
		"wax-atomic.eosiomadrid.io",
		"wax-atomic.wizardsguild.one",
	],
	API: [
		"wax.eosphere.io",
		"api.wax.alohaeos.com",
		"wax.greymass.com",
		"api-wax.eosarabia.net",
		"api-wax.eosauthority.com",
		"api.hivebp.io",
		"api.wax.eosdetroit.io",
		"api.wax.greeneosio.com",
		"api.wax.liquidstudios.io",
		"api.waxsweden.org",
		"apiwax.3dkrender.com",
		"wax-bp.wizardsguild.one",
		"wax.blacklusion.io",
		"wax.blokcrafters.io",
		"wax.cryptolions.io",
		"wax.dapplica.io",
		"wax.eosdac.io",
		"wax.eosdublin.io",
		"wax.eoseoul.io",
		"wax.eosn.io",
		"wax.eu.eosamsterdam.net",
		"wax.pink.gg",
		"waxapi.ledgerwise.io",
	],
};

export const RARITIES = {
	Metal: 1,
	Jadeite: 2,
	Silver: 3,
	Gold: 4,
	Helium: 5,
};

export interface AppContextInterface {
	ual: UAL;
	waxEndpoint: string;
	atomicEndpoint: string;
	setWAXEndpoint: (endpoint: string) => void;
	setAtomicEndpoint: (endpoint: string) => void;
}

export const AppCtx = React.createContext<AppContextInterface>(null);

export const DAPP_NAME = "simplehe3";

export const WAX_CHAIN = {
	chainId: "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
	rpcEndpoints: [{ protocol: "https", host: "wax.eosphere.io", port: 443 }],
};

export const BLOCKCHAIN = {
	DAPP_CONTRACT: "moonmhe3game",
	AA_COLLECTION: "moonminingh3",
	TOKEN_CONTRACT: "moonmhe3tokn",
	TOKEN_SYMBOL: "HEL",
	AUTHENTICATORS: [new Anchor([WAX_CHAIN], { appName: DAPP_NAME }), new WCW([WAX_CHAIN], {})],
};
