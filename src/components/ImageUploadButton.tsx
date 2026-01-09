import { useRef } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";

interface ImageUploadButtonProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

export function ImageUploadButton({
  onImageSelect,
  disabled = false,
}: ImageUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageSelect(file);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className="w-full backdrop-blur-xl bg-white/30 rounded-2xl p-4 shadow-xl cursor-pointer hover:shadow-2xl hover:bg-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden border border-white/40"
      >
        {/* Glass shine effect */}
        <motion.div
          className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent"
          initial={{ opacity: 0.5 }}
          whileHover={{ opacity: 0.8 }}
          transition={{ duration: 0.3 }}
          whileTap={{ scale: 0.98 }}
        />

        <div className="relative z-10 flex items-center justify-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
            className="bg-linear-to-br from-pink-100 to-purple-accent p-4 rounded-full shadow-lg"
          >
            <ImageIcon className="w-6 h-6 md:w-7 md:h-7 text-pink-400" />
          </motion.div>
          <div className="text-left text-pink-400">
            <h2 className="text-xl md:text-2xl font-bold">
              Upload Photo
            </h2>
            <p className="text-xs md:text-sm">
              Choose from your device
            </p>
          </div>
        </div>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
