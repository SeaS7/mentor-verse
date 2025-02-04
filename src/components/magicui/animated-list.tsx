"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { ReactElement, useEffect, useMemo, useState, useRef } from "react";

export const AnimatedList = React.memo(
    ({
        className,
        children,
        delay = 1000,
    }: {
        className?: string;
        children: React.ReactNode;
        delay?: number;
    }) => {
        const [index, setIndex] = useState(0);
        const childrenArray = React.Children.toArray(children);
        const intervalRef = useRef<NodeJS.Timeout | null>(null);

        const startInterval = () => {
            intervalRef.current = setInterval(() => {
                setIndex(prevIndex => (prevIndex + 1) % childrenArray.length);
            }, delay);
        };

        const stopInterval = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };

        useEffect(() => {
            startInterval();
            return () => stopInterval();
        }, [childrenArray.length, delay]);

        const itemsToShow = useMemo(
            () => childrenArray.slice(0, index + 1).reverse(),
            [index, childrenArray]
        );

        return (
            <div
                className={`relative flex flex-col items-center gap-4 ${className}`}
                onMouseEnter={stopInterval}
                onMouseLeave={startInterval}
            >
                <AnimatePresence>
                    {itemsToShow.map(item => (
                        <AnimatedListItem key={(item as ReactElement).key}>{item}</AnimatedListItem>
                    ))}
                </AnimatePresence>
            </div>
        );
    }
);

AnimatedList.displayName = "AnimatedList";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
    const animations = {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1, originY: 0 },
        exit: { scale: 0, opacity: 0 },
        transition: { type: "spring", stiffness: 350, damping: 40 },
    };

    return (
        <motion.div {...animations} layout className="mx-auto w-full">
            {children}
        </motion.div>
    );
}
