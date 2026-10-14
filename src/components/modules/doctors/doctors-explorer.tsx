"use client";

import { ChevronDown, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ListPager from "@/components/modules/list-pager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllDoctors } from "@/hooks/doctor.hook";
import type { DoctorParams } from "@/types";
import DoctorCard, { DoctorCardSkeleton } from "./doctor-card";

const pageSize = 12;

const pill =
  "h-11 rounded-full border border-border bg-card text-sm text-foreground shadow-none outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

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
  useEffect(() => {
    const next = draft.trim();
    if (next === searchTerm) return;
    const timer = window.setTimeout(() => {
      setSearchTerm(next);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [draft, searchTerm]);

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
  const filtered =
    draft.trim() !== "" ||
    specialization !== "" ||
    maxFee !== "" ||
    minExperience !== "" ||
    sortIndex !== 0;

  const clearFilters = () => {
    setDraft("");
    setSearchTerm("");
    setSpecialization("");
    setMaxFee("");
    setMinExperience("");
    setSortIndex(0);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSearchTerm(draft.trim());
          setPage(1);
        }}
      >
        <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
          <div className="relative col-span-2 min-w-0 md:flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="doctor-search"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search doctor..."
              aria-label="Search doctors"
              className={`${pill} w-full pr-4 pl-11`}
            />
          </div>
          <div className="relative col-span-2 sm:col-span-1 md:w-48">
            <select
              id="doctor-specialty"
              aria-label="Specialty"
              className={`${pill} w-full appearance-none pr-10 pl-4`}
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
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <Input
            id="doctor-experience"
            inputMode="numeric"
            value={minExperience}
            onChange={(event) => {
              setMinExperience(event.target.value);
              setPage(1);
            }}
            placeholder="Min"
            aria-label="Minimum years of experience"
            className={`${pill} w-full px-4 md:w-24`}
          />
          <Input
            id="doctor-fee"
            inputMode="numeric"
            value={maxFee}
            onChange={(event) => {
              setMaxFee(event.target.value);
              setPage(1);
            }}
            placeholder="Max"
            aria-label="Highest fee in BDT"
            className={`${pill} w-full px-4 md:w-24`}
          />
          <div className="relative col-span-2 sm:col-span-1 md:w-44">
            <select
              id="doctor-sort"
              aria-label="Sort"
              className={`${pill} w-full appearance-none pr-10 pl-4`}
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
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          {filtered ? (
            <Button
              type="button"
              variant="outline"
              className="col-span-2 h-11 rounded-full sm:col-span-1"
              onClick={clearFilters}
            >
              Clear
            </Button>
          ) : null}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {isPending
            ? "Loading doctors…"
            : `${total ?? 0} ${total === 1 ? "doctor" : "doctors"}`}
        </p>
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
