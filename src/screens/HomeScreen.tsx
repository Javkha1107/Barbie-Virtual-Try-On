import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { StarDecoration } from "../components/decorations/StarDecoration";
import { HeartDecoration } from "../components/decorations/HeartDecoration";

export function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-pastel to-purple-accent flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative elements - scaled for portrait */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <StarDecoration className="absolute top-4 left-4 md:top-10 md:left-10 scale-75 md:scale-100" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <StarDecoration className="absolute top-8 right-8 md:top-20 md:right-20 scale-75 md:scale-100" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <StarDecoration className="absolute bottom-10 left-4 md:bottom-20 md:left-20 scale-75 md:scale-100" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <HeartDecoration className="absolute top-1/4 right-4 md:right-10 scale-75 md:scale-100" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6 md:space-y-8 z-10 px-4"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-pink-primary font-heading leading-tight"
        >
          Barbie Virtual Fitting
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/recording")}
            className="text-lg font-semibold py-7 px-12 md:px-16 rounded-full"
          >
            Start Recording
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
