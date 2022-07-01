import React from "react";

export function Alert(props: { color: string; message: string }) {
	return (
		<>
			{props?.message && (
				<div className={`flex flex-col p-4 rounded drop-shadow pointer fixed top-5 right-5 bg-${props.color}`}>
					<span className="text-white text-xm">{props.message}</span>
				</div>
			)}
		</>
	);
}
