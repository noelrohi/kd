import { Card } from "@/components/card";
import { placeholderImage } from "@/config/site";

export function FallBackCard({
  aspectRatio = "portrait",
}: {
  aspectRatio?: "portrait" | "square";
}) {
  const numbers = Array.from({ length: 5 }, (_, index) => index + 1);
  return numbers.map((number) => (
    <Card
      key={number}
      width={330}
      height={250}
      className="w-28 lg:w-[250px]"
      aspectRatio={aspectRatio}
      data={{
        description: "",
        title: "...",
        image: placeholderImage("loading.. "),
      }}
    />
  ));
}
