"use client";

import { useState } from "react";
import CreateManagedAccountForm from "@/components/form/create-managed-account-form";
import AccountStatusButton from "@/components/modules/account-status/account-status-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMe } from "@/hooks/auth.hook";
import { useGetAdmins } from "@/hooks/user.hook";

export default function AdminsPanel() {
  const { data: me } = useGetMe();
  const isSuperAdmin = me?.data?.role === "SUPER_ADMIN";
  const [page, setPage] = useState(1);
  const [createKind, setCreateKind] = useState<"ADMIN" | "SUPER_ADMIN" | null>(
    null,
  );
  const { data, isPending, isError } = useGetAdmins({ page, limit: 10 });
  const admins = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => setCreateKind("ADMIN")}>
          Create admin
        </Button>
        {isSuperAdmin ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setCreateKind("SUPER_ADMIN")}
          >
            Create super admin
          </Button>
        ) : null}
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading admins...</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-destructive">Could not load admins.</p>
      ) : null}

      {!isPending && !isError ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Organization email</TableHead>
                <TableHead>Personal email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                {isSuperAdmin ? (
                  <TableHead className="text-right">Action</TableHead>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isSuperAdmin ? 6 : 5}>
                    No admins found.
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.admin?.personalEmail || "—"}</TableCell>
                    <TableCell>
                      {admin.role === "SUPER_ADMIN" ? "Super admin" : "Admin"}
                    </TableCell>
                    <TableCell>{admin.status}</TableCell>
                    {isSuperAdmin ? (
                      <TableCell className="text-right">
                        <AccountStatusButton
                          userId={admin.id}
                          status={admin.status}
                        />
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : null}

      {totalPages > 1 ? (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
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
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}

      <Sheet
        open={createKind !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCreateKind(null);
          }
        }}
      >
        <SheetContent className="overflow-y-auto p-6">
          <SheetHeader>
            <SheetTitle>
              {createKind === "SUPER_ADMIN"
                ? "Create super admin"
                : "Create admin"}
            </SheetTitle>
            <SheetDescription>
              The organization email is the login. A temporary password is sent
              to the personal email.
            </SheetDescription>
          </SheetHeader>
          {createKind ? (
            <CreateManagedAccountForm
              kind={createKind}
              onDone={() => setCreateKind(null)}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
