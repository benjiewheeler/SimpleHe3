import { Authenticator, Chain, UALError, User as UALUser } from "universal-authenticator-library";

export type User = { accountName: string; requestPermission: string } & Pick<UALUser, "signTransaction">;

export type UAL = {
	activeAuthenticator: Authenticator;
	activeUser: User;
	appName: string;
	authenticators: Authenticator[];
	chains: Chain[];
	error: UALError;
	hideModal: () => void;
	isAutoLogin: boolean;
	loading: boolean;
	logout: () => void;
	message: string;
	modal: boolean;
	restart: () => void;
	showModal: () => void;
	users: User[];
};

export type AssetTemplate = {
	name: string;
	img: string;
	schema_name: string;
	template_id: number;
	rarity: string;
};

export type AtomicAsset = {
	asset_id: string;
	name: string;
	mint: number;
	img: string;
	schema_name: string;
	template_id: number;
	rarity: string;
};

export type ContractAsset = {
	asset_id: string;
	template_id: number;
	owner: string;
	last_claim: number;
	delay: number;
	power: string[];
	token_reserve: string[];
};

export type ToolConfig = {
	template_id: number;
	type: "building" | "machine";
	token_input: string[];
	token_output: string[];
	delay: number;
	maxstorage: string;
	rarityID: number;
};

export type ShopConfig = {
	id: number;
	template_id: number;
	price: Token;
};

export type Tool = AssetTemplate & ToolConfig & ContractAsset;
export type Mineral = AssetTemplate & AtomicAsset;

export type Token = {
	symbol: string;
	amount: number | string;
};

export interface CacheObject<T> {
	expiration: number;
	value: T;
}
