"use client";

import {
	getVariants,
	IconWrapper,
	useAnimateIconContext,
	type IconProps,
} from "@/components/ui/animate-icon";
import { motion, type Variants } from "motion/react";

type BellProps = IconProps<keyof typeof animations>;

const animations = {
	default: {
		path1: {
			initial: { rotate: 0 },
			animate: {
				rotate: [0, -10, 10, -10, 10, -5, 5, 0],
				transition: {
					duration: 1,
					ease: "easeInOut",
				},
			},
		},
		path2: {},
	} satisfies Record<string, Variants>,
} as const;

function IconComponent({ size, ...props }: BellProps) {
	const { controls } = useAnimateIconContext();
	const variants = getVariants(animations);

	return (
		<motion.svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<motion.g
				variants={variants.path1}
				initial="initial"
				animate={controls}
				style={{ originX: 0.5, originY: 0.1 }}
			>
				<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
				<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
			</motion.g>
		</motion.svg>
	);
}

function Bell(props: BellProps) {
	return <IconWrapper icon={IconComponent} {...props} />;
}

export { animations, Bell, Bell as BellIcon, type BellProps as BellIconProps, type BellProps };
