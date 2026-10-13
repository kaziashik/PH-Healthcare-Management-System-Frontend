"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DoctorParams, DoctorVerificationStatus } from "@/types";
import { Suspense, useState } from "react";
import DoctorApprovalTable from "./doctor-approval-table";
import DoctorApprovalTableLoading from "./doctor-approval-table-loading";
import DoctorReviewSheet from "./doctor-review-sheet";

export default function DoctorApprovalTabs({
  status,
}: {
  status: DoctorVerificationStatus;
}) {
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const queryParams: DoctorParams = {
    page: 1,
    limit: 50,
    verificationStatus: status,
    ...(searchTerm ? { searchTerm } : {}),
  };

  return (
    <>
      <form
        className="my-5 flex max-w-md gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setSearchTerm(draft.trim());
        }}
      >
        <Input
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Search by name or email"
          aria-label="Search doctors"
        />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      <Suspense fallback={<DoctorApprovalTableLoading />}>
        <DoctorApprovalTable
          {...queryParams}
          handleReview={setSelectedId}
          reviewLabel={status === "PENDING" ? "Review" : "View"}
        />
      </Suspense>

      <DoctorReviewSheet
        selectedId={selectedId}
        onClose={() => setSelectedId("")}
        canDecide={status === "PENDING"}
        {...queryParams}
      />
    </>
  );
}
