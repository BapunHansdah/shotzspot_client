import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
];

export default function AIInfluencerScrollerLoader() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-96 w-full max-w-md items-center justify-center overflow-hidden rounded-2xl  p-4">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[currentIndex]}
          src={images[currentIndex]}
          alt="dummy user"
          className="h-40 w-40 rounded-full border-4 border-white object-cover shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.6 }}
        />
      </AnimatePresence>
      <motion.div
        className="absolute bottom-6 text-center"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-lg font-semibold">AI Matching in Progress…</p>
        <p className="text-sm text-gray-400">Scanning profiles</p>
      </motion.div>
    </div>
  );
}
