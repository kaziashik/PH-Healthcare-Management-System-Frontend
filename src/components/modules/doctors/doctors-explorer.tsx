"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import ListPager from "@/components/modules/list-pager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllDoctors } from "@/hooks/doctor.hook";
import type { DoctorParams } from "@/types";
import DoctorCard, { DoctorCardSkeleton } from "./doctor-card";

const pageSize = 12;

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

  const total = data?.meta?.total;

  return (
    <div className="flex flex-col gap-6">
      <form
        className="panel flex flex-col gap-4 p-4 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setSearchTerm(draft.trim());
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="doctor-search">
            Search
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="doctor-search"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Doctor name or specialty"
              className="sm:flex-1"
            />
            <div className="flex gap-2">
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
                Clear
              </Button>
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5">
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
          <div className="flex flex-col gap-1.5">
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
              placeholder="No limit"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="doctor-experience">
              Minimum experience
            </label>
            <Input
              id="doctor-experience"
              inputMode="numeric"
              value={minExperience}
              onChange={(event) => {
                setMinExperience(event.target.value);
                setPage(1);
              }}
              placeholder="Any years"
            />
          </div>
          <div className="flex flex-col gap-1.5">
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
        </div>
      </form>
      <p className="text-sm text-muted-foreground">
        {isPending
          ? "Loading doctors…"
          : `${total ?? 0} ${total === 1 ? "doctor" : "doctors"}`}
      </p>

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
        <div
          id="appointments"
          className="grid scroll-mt-24 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
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
