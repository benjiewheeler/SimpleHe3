import React from "react";

export function Loader() {
	return (
		<div className="flex flex-col items-center p-4">
			<div className="aspect-square border border-4 border-b-transparent animate-spin rounded-full border-red-900 w-12 h-12" ></div>
		</div>
	);
}
