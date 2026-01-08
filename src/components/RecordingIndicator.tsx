import { motion } from "framer-motion";

interface RecordingIndicatorProps {
  isRecording: boolean;
  remainingTime: number;
}

export function RecordingIndicator({
  isRecording,
  remainingTime,
}: RecordingIndicatorProps) {
  if (!isRecording) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="absolute top-5 right-1/2 translate-x-1/2 z-20 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="w-3 h-3 bg-white rounded-full"
      />
      <span className="font-semibold">Recording {remainingTime}s</span>
    </motion.div>
  );
}
