import type { ClothingItem } from "../context/AppContext";
import { ClothingCard } from "./ClothingCard";

interface ClothingGridProps {
  items: ClothingItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ClothingGrid({
  items,
  selectedId,
  onSelect,
}: ClothingGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-md sm:max-w-4xl mx-auto py-1">
      {items.map((item) => (
        <ClothingCard
          key={item.id}
          item={item}
          isSelected={item.id === selectedId}
          onSelect={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
}
