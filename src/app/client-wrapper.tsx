"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode } from "react";

interface ClientWrapperProps {
    children: (props: { yStats: any }) => ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
    const { scrollYProgress } = useScroll();
    const yStats = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

    return <>{children({ yStats })}</>;
}
