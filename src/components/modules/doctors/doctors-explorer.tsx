"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import ListPager from "@/components/modules/list-pager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllDoctors } from "@/hooks/doctor.hook";
import type { DoctorParams } from "@/types";
import DoctorCard, { DoctorCardSkeleton } from "./doctor-card";

const sorts: {
  label: string;
  params: Pick<DoctorParams, "sortBy" | "sortOrder">;
}[] = [
  { label: "Newest", params: { sortBy: "createdAt", sortOrder: "desc" } },
  { label: "Name", params: { sortBy: "name", sortOrder: "asc" } },
  { label: "Fee", params: { sortBy: "consultationFee", sortOrder: "asc" } },
  {
    label: "Experience",
    params: { sortBy: "experienceYears", sortOrder: "desc" },
  },
];

export default function DoctorsExplorer() {
  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const specialtyQuery = useSearchParams().get("specialty") ?? "";
  const [specialization, setSpecialization] = useState(specialtyQuery);
  const [maxFee, setMaxFee] = useState("");
  const [sortIndex, setSortIndex] = useState(0);
  const catalog = useGetAllDoctors({ page: 1, limit: 50 });
  const specializations = [
    ...new Set(
      (catalog.data?.data ?? [])
        .map((doctor) => doctor.specialization)
        .filter(Boolean),
    ),
  ];
  const sort = sorts[sortIndex] ?? sorts[0];
  const parsedFee = Number(maxFee);
  const { data, isPending, isError } = useGetAllDoctors({
    page,
    limit: 6,
    ...(searchTerm ? { searchTerm } : {}),
    ...(specialization ? { specialization } : {}),
    ...(maxFee && !Number.isNaN(parsedFee) ? { maxFee: parsedFee } : {}),
    ...sort.params,
  });
  const doctors = data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <form
        className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setSearchTerm(draft.trim());
        }}
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="doctor-search">
            Search
          </label>
          <Input
            id="doctor-search"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Name, email, or specialty"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="doctor-specialty">
            Specialty
          </label>
          <select
            id="doctor-specialty"
            className="select-control"
            value={specialization}
            onChange={(event) => {
              setSpecialization(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All specialties</option>
            {specializations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="doctor-fee">
            Highest fee (BDT)
          </label>
          <Input
            id="doctor-fee"
            inputMode="numeric"
            value={maxFee}
            onChange={(event) => {
              setMaxFee(event.target.value);
              setPage(1);
            }}
            placeholder="500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="doctor-sort">
            Sort
          </label>
          <select
            id="doctor-sort"
            className="select-control"
            value={sortIndex}
            onChange={(event) => {
              setSortIndex(Number(event.target.value));
              setPage(1);
            }}
          >
            {sorts.map((item, index) => (
              <option key={item.label} value={index}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <Button className="md:col-span-4 md:w-fit" type="submit">
          Search
        </Button>
      </form>

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DoctorCardSkeleton />
          <DoctorCardSkeleton />
          <DoctorCardSkeleton />
        </div>
      ) : null}
      {isError ? (
        <p className="text-sm text-destructive">Could not load doctors.</p>
      ) : null}
      {!isPending && !isError && doctors.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No approved doctors match those filters.
        </p>
      ) : null}
      {!isPending && !isError && doctors.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : null}
      <ListPager
        page={page}
        totalPages={data?.meta?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
