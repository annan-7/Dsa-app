"use client";

import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ComponentType, type ReactElement, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/libs/utiles";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	asChild?: boolean;
	children?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
	primary: "bg-orange-500 text-zinc-950 hover:bg-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.25)]",
	secondary: "border border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-600 hover:bg-zinc-800",
	ghost: "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50",
};

const sizeClasses: Record<ButtonSize, string> = {
	sm: "h-9 px-3 text-sm",
	md: "h-11 px-4 text-sm",
	lg: "h-12 px-5 text-base",
};

export function Button({ className, variant = "secondary", size = "md", asChild = false, children, ...props }: ButtonProps) {
	const buttonClasses = cn(
		"inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50",
		"active:scale-[0.98]",
		variantClasses[variant],
		sizeClasses[size],
		className,
	);

	if (asChild && isValidElement(children)) {
		return cloneElement(children as ReactElement<{ className?: string }>, {
			className: cn(buttonClasses, (children.props as { className?: string }).className),
			...props,
		});
	}

	const MotionButton = motion.button as unknown as ComponentType<Record<string, unknown>>;

	return (
		<MotionButton
			whileTap={{ scale: 0.95 }}
			className={buttonClasses}
			{...props}
		>
			{children}
		</MotionButton>
	);
}
