"use client";

import { useState } from "react";
import AccountStatusButton from "@/components/modules/account-status/account-status-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetPatients } from "@/hooks/user.hook";

export default function PatientsPanel() {
  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isPending, isError } = useGetPatients({
    page,
    limit: 10,
    ...(searchTerm ? { searchTerm } : {}),
  });
  const patients = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="flex flex-col gap-5">
      <form
        className="flex max-w-md gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setSearchTerm(draft.trim());
        }}
      >
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Search by name or email"
          aria-label="Search patients"
        />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading patients...</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-destructive">Could not load patients.</p>
      ) : null}

      {!isPending && !isError ? (
        <div className="panel">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>No patients found.</TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>
                      {patient.patient?.contactNumber || "—"}
                    </TableCell>
                    <TableCell>{patient.status}</TableCell>
                    <TableCell className="text-right">
                      <AccountStatusButton
                        userId={patient.id}
                        status={patient.status}
                      />
                    </TableCell>
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
    </div>
  );
}
