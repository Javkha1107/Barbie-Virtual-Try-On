import type { ClothingItem } from "../context/AppContext";

interface ClothingCardProps {
  item: ClothingItem;
  isSelected: boolean;
  onSelect: () => void;
}

export function ClothingCard({
  item,
  isSelected,
  onSelect,
}: ClothingCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`
        group
        relative cursor-pointer rounded-2xl overflow-hidden
        ${isSelected
          ? "ring-2 ring-pink-300"
          : "hover:shadow-lg"
        }
      `}
    >
      <img
        src={item.thumbnailUrl}
        alt={item.name}
        className="w-full h-full object-cover select-none"
        draggable={false}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-pink-600/70 via-pink-600/40 pt-20 group-hover:from-pink-500/80 group-hover:pt-24 to-transparent p-4 transition-all duration-300">
        <h3 className="text-white font-semibold text-base sm:text-lg leading-tight mb-1">
          {item.name}
        </h3>
        {item.description && (
          <div className="overflow-hidden transition-all duration-300 max-h-10 group-hover:max-h-32">
            <p className="text-white/90 text-sm sm:text-base leading-snug">
              {item.description}
            </p>
          </div>
        )}
      </div>

      {isSelected && (
        <div className="absolute top-3 right-3 bg-pink-400 text-white shadow-xl rounded-full p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
