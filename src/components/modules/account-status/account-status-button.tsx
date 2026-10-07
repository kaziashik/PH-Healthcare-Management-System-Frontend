"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useGetMe } from "@/hooks/auth.hook";
import { useUpdateAccountStatus } from "@/hooks/user.hook";
import type { UserStatus } from "@/types/user.type";
import { apiErrorMessage } from "@/utils";

export default function AccountStatusButton({
  userId,
  status,
}: {
  userId: string;
  status: UserStatus;
}) {
  const { data } = useGetMe();
  const { mutate, isPending, variables } = useUpdateAccountStatus();
  const currentUserId = data?.data?.id;

  if (status === "DELETED") {
    return <span className="text-sm text-muted-foreground">Deleted</span>;
  }

  if (currentUserId === userId) {
    return <span className="text-sm text-muted-foreground">You</span>;
  }

  const nextStatus = status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
  const thisRowPending = isPending && variables?.userId === userId;

  return (
    <Button
      type="button"
      size="sm"
      variant={nextStatus === "BLOCKED" ? "destructive" : "outline"}
      disabled={thisRowPending}
      onClick={() => {
        mutate(
          { userId, status: nextStatus },
          {
            onSuccess: (response) => {
              toast.add({
                title:
                  nextStatus === "BLOCKED"
                    ? "Account blocked"
                    : "Account unblocked",
                description: response.message,
                type: "success",
              });
            },
            onError: (error) => {
              toast.add({
                title: "Could not update account",
                description: apiErrorMessage(error),
                type: "error",
              });
            },
          },
        );
      }}
    >
      {thisRowPending ? (
        <Spinner />
      ) : nextStatus === "BLOCKED" ? (
        "Block"
      ) : (
        "Unblock"
      )}
    </Button>
  );
}
