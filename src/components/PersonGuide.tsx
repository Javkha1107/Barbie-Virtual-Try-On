import { motion } from "framer-motion";

export function PersonGuide() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 "
    >
      <div className="flex flex-col items-center size-full justify-between pt-10">

        <img src='/src/assets/1.png' alt="Person Guide" className="h-8/9" />
      </div>
    </motion.div>
  );
}
