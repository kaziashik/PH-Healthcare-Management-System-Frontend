"use client";

import {
  ArrowUpDown,
  Banknote,
  Briefcase,
  Search,
  SlidersHorizontal,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import ListPager from "@/components/modules/list-pager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllDoctors } from "@/hooks/doctor.hook";
import type { DoctorParams } from "@/types";
import DoctorCard, { DoctorCardSkeleton } from "./doctor-card";

const pageSize = 12;

function FilterField({
  id,
  label,
  icon: Icon,
  children,
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="flex items-center gap-1.5 text-sm font-medium"
        htmlFor={id}
      >
        <Icon className="size-3.5 text-primary" aria-hidden="true" />
        {label}
      </label>
      {children}
    </div>
  );
}

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
        className="panel flex flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setSearchTerm(draft.trim());
        }}
      >
        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <SlidersHorizontal className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">Search the roster</p>
                <p className="text-xs text-muted-foreground">
                  Name, specialty, fee, or years of experience
                </p>
              </div>
            </div>
            <p className="shrink-0 pt-1 text-sm font-medium text-muted-foreground">
              {isPending
                ? "Loading…"
                : `${total ?? 0} ${total === 1 ? "doctor" : "doctors"}`}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative sm:flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="doctor-search"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Doctor name or specialty"
                aria-label="Search doctors"
                className="h-10 pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Button type="submit" className="h-10">
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10"
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
        <div className="grid gap-3 border-t bg-muted/40 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
          <FilterField id="doctor-specialty" label="Specialty" icon={Stethoscope}>
            <select
              id="doctor-specialty"
              className="select-control h-10"
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
          </FilterField>
          <FilterField id="doctor-fee" label="Highest fee (BDT)" icon={Banknote}>
            <Input
              id="doctor-fee"
              inputMode="numeric"
              value={maxFee}
              onChange={(event) => {
                setMaxFee(event.target.value);
                setPage(1);
              }}
              placeholder="No limit"
              className="h-10"
            />
          </FilterField>
          <FilterField
            id="doctor-experience"
            label="Minimum experience"
            icon={Briefcase}
          >
            <Input
              id="doctor-experience"
              inputMode="numeric"
              value={minExperience}
              onChange={(event) => {
                setMinExperience(event.target.value);
                setPage(1);
              }}
              placeholder="Any years"
              className="h-10"
            />
          </FilterField>
          <FilterField id="doctor-sort" label="Sort" icon={ArrowUpDown}>
            <select
              id="doctor-sort"
              className="select-control h-10"
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
          </FilterField>
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
