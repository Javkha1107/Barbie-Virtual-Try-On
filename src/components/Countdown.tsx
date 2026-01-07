import { motion } from "framer-motion";

interface CountdownProps {
  count: number;
}

export function Countdown({ count }: CountdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 pb-40 flex items-center justify-center z-20 pointer-events-none"
    >
      <motion.div
        key={count}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-9xl font-bold text-white drop-shadow-2xl"
        style={{ textShadow: "0 0 20px rgba(0,0,0,0.8)" }}
      >
        {count}
      </motion.div>
    </motion.div>
  );
}
