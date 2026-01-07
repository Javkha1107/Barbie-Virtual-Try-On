import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "../lib/utils";

interface Clothing {
  id: string;
  name: string;
  thumbnail: string;
  color: string;
}

// ダミーデータ
const BARBIE_CLOTHES: Clothing[] = [
  { id: "1", name: "ピンクドレス", thumbnail: "👗", color: "bg-pink-200" },
  { id: "2", name: "ブルードレス", thumbnail: "👗", color: "bg-blue-200" },
  { id: "3", name: "イエロードレス", thumbnail: "👗", color: "bg-yellow-200" },
  { id: "4", name: "パープルドレス", thumbnail: "👗", color: "bg-purple-200" },
  { id: "5", name: "グリーンドレス", thumbnail: "👗", color: "bg-green-200" },
  { id: "6", name: "レッドドレス", thumbnail: "👗", color: "bg-red-200" },
];

interface ClothingSelectorProps {
  onSelect: (clothing: Clothing) => void;
  selectedId?: string;
}

export function ClothingSelector({
  onSelect,
  selectedId,
}: ClothingSelectorProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedId);

  const handleSelect = (clothing: Clothing) => {
    setSelected(clothing.id);
    onSelect(clothing);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>バービー衣装を選択</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {BARBIE_CLOTHES.map((clothing) => (
            <button
              key={clothing.id}
              onClick={() => handleSelect(clothing)}
              className={cn(
                "aspect-square rounded-lg border-2 transition-all hover:scale-105",
                "flex flex-col items-center justify-center gap-2 p-4",
                clothing.color,
                selected === clothing.id
                  ? "border-pink-500 ring-2 ring-pink-500"
                  : "border-gray-300"
              )}
            >
              <span className="text-4xl">{clothing.thumbnail}</span>
              <span className="text-xs font-medium text-gray-700">
                {clothing.name}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
