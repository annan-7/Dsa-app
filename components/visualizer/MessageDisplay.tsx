"use client";

import { AnimatePresence, motion } from "framer-motion";

interface MessageDisplayProps {
	message: string;
}

export function MessageDisplay({ message }: MessageDisplayProps) {
	return (
		<div className="min-h-[72px] rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
			<AnimatePresence mode="wait">
				<motion.p
					key={message}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -6 }}
					transition={{ duration: 0.22, ease: "easeOut" }}
					className="text-sm leading-6 text-zinc-300"
				>
					{message}
				</motion.p>
			</AnimatePresence>
		</div>
	);
}
