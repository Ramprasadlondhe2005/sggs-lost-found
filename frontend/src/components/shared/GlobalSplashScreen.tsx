import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import mapAnimation from "@/assets/map.json"; // Reusing the same map animation
import { motion, AnimatePresence } from "framer-motion";

export function GlobalSplashScreen() {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        // Show splash screen for exactly 2.5 seconds
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {showSplash && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/90 backdrop-blur-2xl"
                >
                    {/* Animated Map Container */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                        className="w-64 sm:w-80 md:w-96 mb-8 drop-shadow-2xl mix-blend-multiply dark:mix-blend-lighten"
                    >
                        {Object.keys(mapAnimation).length > 0 ? (
                            <Lottie animationData={mapAnimation} loop={true} />
                        ) : null}
                    </motion.div>

                    {/* Marathi Tagline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/50 text-glow text-center px-4 py-4 leading-normal"
                    >
                        हरवलं काही? <br className="sm:hidden" />
                        <span className="text-foreground">इथेच मिळेल भाई!</span>
                    </motion.h1>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "200px" }}
                        transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
                        className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent mt-8 rounded-full"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
