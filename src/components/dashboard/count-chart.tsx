export default function CountChart({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="panel p-4">
      <h2 className="mb-4 font-semibold">Account totals</h2>
      <div className="flex h-48 items-end gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <span className="text-sm font-medium">{item.value}</span>
            <div
              className="w-full rounded-t-lg bg-primary"
              style={{ height: `${Math.max((item.value / max) * 100, 8)}%` }}
            />
            <span className="text-center text-xs text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
