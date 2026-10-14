import { Stethoscope } from "lucide-react";

export default function BrandMark({
  className = "",
  wordmarkClassName = "",
  showWordmark = true,
}: {
  className?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-semibold tracking-tight ${className}`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#14b8a6] text-[#042028]">
        <Stethoscope className="size-5" aria-hidden="true" />
      </span>
      {showWordmark ? (
        <span className={`whitespace-nowrap ${wordmarkClassName}`}>
          PH Healthcare
        </span>
      ) : null}
    </span>
  );
}
