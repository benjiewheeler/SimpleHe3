import axios from "axios";
import { BLOCKCHAIN } from "./constants";
import { AssetTemplate, CacheObject, ContractAsset, Token, Tool, ToolConfig } from "./types";

/**
 * Store data in the browser's localStorage
 * @param key The key to store the data under
 * @param value the value of the stored data
 * @param expiration time to expiration (in seconds), null or zero means no expire
 */
export function setStorageItem<T>(key: string, value: T, expiration: number = null): void {
	try {
		const obj: CacheObject<T> = { value, expiration: null };
		if (expiration) {
			obj.expiration = Date.now() + expiration * 1e3;
		}
		localStorage.setItem(key, JSON.stringify(obj));
	} catch (error) {
		localStorage.clear();
	}
}

/**
 * Retrieve data stored in the browser's localStorage
 * @param key The key to retrieve the data from
 * @param defaultValue the value to return in case an error was thrown during deserialization, or the key was not found, or it was expired
 */
export function getStorageItem<T>(key: string, defaultValue?: T): T {
	try {
		const json = localStorage.getItem(key);
		const obj: CacheObject<T> = JSON.parse(json);
		if (obj?.expiration && obj?.expiration < Date.now()) {
			return defaultValue;
		}
		if (obj?.value === null || obj?.value === undefined) {
			return defaultValue;
		}
		return obj.value;
	} catch (error) {
		return defaultValue;
	}
}

export const parseToken = (token: string): Token => {
	const [value, symbol] = token.split(/\s+/gi);
	const amount = parseFloat(value);
	return { amount, symbol };
};

export const formatTokenDisplay = (token: Token): string => {
	return `${token.amount.toLocaleString("en", { useGrouping: true, maximumFractionDigits: 4 })} ${token.symbol}`;
};

export const adjustTokenSymbol = (token: Token): Token => {
	const MAP = { HEL: "He3", HTWO: "H2", MWH: "MWh", OTWO: "O2", WATER: "H2O" };
	return { amount: token.amount, symbol: MAP[token.symbol] || token.symbol };
};

export const fetchTemplates = async (endpoint: string): Promise<AssetTemplate[]> => {
	const cache = getStorageItem<AssetTemplate[]>(`templates`, null);
	if (cache) {
		return cache;
	}

	const response = await axios.get(`https://${endpoint}/atomicassets/v1/templates`, {
		params: { collection_name: "moonminingh3", page: 1, limit: 1000, order: "desc", sort: "created" },
		responseType: "json",
		headers: { "Content-Type": "application/json;charset=UTF-8" },
	});

	const templates = [...response.data.data].map<AssetTemplate>(t => ({
		img: t.immutable_data.img,
		name: t.immutable_data.name,
		rarity: t.immutable_data.rarity,
		shine: t.immutable_data.shine,
		template_id: t.template_id,
		schema_name: t.schema.schema_name,
	}));

	setStorageItem<AssetTemplate[]>(`templates`, templates, 0);
	return templates;
};

export const fetchPlayerTools = async (account: string, endpoint: string): Promise<ContractAsset[]> => {
	const cache = getStorageItem<ContractAsset[]>(`tools`, null);
	if (cache) {
		return cache;
	}

	const response = await axios.post(
		`https://${endpoint}/v1/chain/get_table_rows`,
		{
			code: "moonmhe3game",
			scope: "moonmhe3game",
			table: "machines",
			lower_bound: account,
			upper_bound: account,
			limit: 100,
			key_type: "i64",
			index_position: "2",
			json: true,
		},
		{
			responseType: "json",
			headers: { "Content-Type": "application/json;charset=UTF-8" },
		}
	);

	const tools = [...response.data.rows].map<ContractAsset>(t => ({ ...t, token_reserve: t.token_in }));

	setStorageItem<ContractAsset[]>(`tools`, tools, 60);
	return tools;
};

export const fetchToolConfigs = async (endpoint: string): Promise<ToolConfig[]> => {
	const cache = getStorageItem<ToolConfig[]>(`toolconfigs`, null);
	if (cache) {
		return cache;
	}

	const response = await axios.post(
		`https://${endpoint}/v1/chain/get_table_rows`,
		{
			code: "moonmhe3game",
			scope: "moonmhe3game",
			table: "bconfigs",
			limit: 500,
			json: true,
		},
		{
			responseType: "json",
			headers: { "Content-Type": "application/json;charset=UTF-8" },
		}
	);

	const tools = [...response.data.rows].map<ToolConfig>(({ rarity, ...t }) => ({
		...t,
		token_input: t.token_in,
		token_output: t.token_out,
		rarityID: rarity,
	}));

	setStorageItem<ToolConfig[]>(`toolconfigs`, tools, 3600);
	return tools;
};
