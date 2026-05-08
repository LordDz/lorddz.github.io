import type { ButtonHTMLAttributes, ReactNode } from "react";

type ActionButtonProps = {
	children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function ActionButton({
	children,
	type = "button",
	...props
}: ActionButtonProps) {
	return (
		<button
			type={type}
			className="cursor-pointer rounded-full border border-[rgba(50,143,151,0.35)] bg-[rgba(79,184,178,0.16)] px-5 py-2 text-sm font-normal text-[var(--lagoon-deep)] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] transition duration-150 hover:bg-[rgba(79,184,178,0.28)] hover:shadow-[0_4px_14px_rgba(79,184,178,0.24)] active:translate-y-px active:bg-[rgba(79,184,178,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(79,184,178,0.45)] disabled:cursor-not-allowed disabled:opacity-50"
			{...props}
		>
			{children}
		</button>
	);
}
