import { Button } from "./ui/button";

interface StartOverButtonProps {
  onClick: () => void;
}

export function StartOverButton({ onClick }: StartOverButtonProps) {
  return (
    <Button size="lg" onClick={onClick} variant="outline">
      もう一度試す
    </Button>
  );
}
