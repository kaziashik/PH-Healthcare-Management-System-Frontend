"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import ListPager from "@/components/modules/list-pager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllDoctors } from "@/hooks/doctor.hook";
import type { DoctorParams } from "@/types";
import DoctorCard, { DoctorCardSkeleton } from "./doctor-card";

const pageSize = 6;

const sorts: {
  label: string;
  params: Pick<DoctorParams, "sortBy" | "sortOrder">;
}[] = [
  { label: "Newest", params: { sortBy: "createdAt", sortOrder: "desc" } },
  { label: "Name", params: { sortBy: "name", sortOrder: "asc" } },
  {
    label: "Lowest fee",
    params: { sortBy: "consultationFee", sortOrder: "asc" },
  },
  {
    label: "Highest fee",
    params: { sortBy: "consultationFee", sortOrder: "desc" },
  },
  {
    label: "Most experience",
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
  const [minExperience, setMinExperience] = useState("");
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
  const parsedExperience = Number(minExperience);
  const { data, isPending, isError } = useGetAllDoctors({
    page,
    limit: pageSize,
    ...(searchTerm ? { searchTerm } : {}),
    ...(specialization ? { specialization } : {}),
    ...(maxFee && !Number.isNaN(parsedFee) ? { maxFee: parsedFee } : {}),
    ...(minExperience && !Number.isNaN(parsedExperience)
      ? { minExperience: parsedExperience }
      : {}),
    ...sort.params,
  });
  const doctors = data?.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <form
        className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-2 xl:grid-cols-3"
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
          <label className="text-sm font-medium" htmlFor="doctor-experience">
            Minimum experience (years)
          </label>
          <Input
            id="doctor-experience"
            inputMode="numeric"
            value={minExperience}
            onChange={(event) => {
              setMinExperience(event.target.value);
              setPage(1);
            }}
            placeholder="5"
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
        <div className="flex flex-wrap gap-2 md:col-span-2 xl:col-span-3">
          <Button type="submit">Search</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDraft("");
              setSearchTerm("");
              setSpecialization("");
              setMaxFee("");
              setMinExperience("");
              setSortIndex(0);
              setPage(1);
            }}
          >
            Clear filters
          </Button>
        </div>
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
        total={data?.meta?.total}
        limit={pageSize}
        onPageChange={setPage}
      />
    </div>
  );
}
