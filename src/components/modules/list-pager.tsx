"use client";

import { Button } from "@/components/ui/button";

export default function ListPager({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total?: number;
  limit?: number;
  onPageChange: (page: number) => void;
}) {
  if (total !== undefined && total <= 0) {
    return null;
  }

  if (total === undefined && totalPages <= 1) {
    return null;
  }

  const start =
    total !== undefined && limit ? (page - 1) * limit + 1 : undefined;
  const end =
    total !== undefined && limit ? Math.min(page * limit, total) : undefined;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {start !== undefined && end !== undefined && total !== undefined ? (
        <p className="text-sm text-muted-foreground">
          Showing {start}–{end} of {total}
        </p>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
