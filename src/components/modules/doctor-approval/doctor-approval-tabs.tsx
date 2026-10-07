"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DoctorApprovalTable from "./doctor-approval-table";
import { Suspense, useState } from "react";
import DoctorApprovalTableLoading from "./doctor-approval-table-loading";
import { DoctorParams, DoctorVerificationStatus } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DoctorReviewSheet from "./doctor-review-sheet";

const verificationStatus: [("ALL" | DoctorVerificationStatus),string][] = [
    ["APPROVED" , "Approved"],
    ["PENDING", "Pending"],
    ["REJECTED", "Rejected"],
    ["ALL", "All"]

]


export default function DoctorApprovalTabs() {



    const [tab,setTab]= useState <"ALL" | DoctorVerificationStatus>("ALL");
    const [selectedId,setSelectedId]=useState("")
    const [draft, setDraft] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const queryParams : DoctorParams={
        page: 1,
        limit:10,
        ...(tab==="ALL" ? {} : {verificationStatus: tab}),
        ...(searchTerm ? { searchTerm } : {}),
    }



    return (
        <>
            <div className="flex justify-between my-5">
                <form
                    className="flex max-w-md gap-2"
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

                <Tabs value={tab} onValueChange={(value)=>setTab(value)}>
                <TabsList>
                    {
                        verificationStatus.map(([value, label])=>(
                            <TabsTrigger key={value} value={value}>{label}</TabsTrigger>
                        ))
                    }

                
                    {/* <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger> */}


                </TabsList>
            </Tabs>

            </div>


            <Suspense fallback={<DoctorApprovalTableLoading />}>
                <DoctorApprovalTable {...queryParams} handleReview={setSelectedId}/>
            </Suspense>

            <DoctorReviewSheet selectedId={selectedId} onClose={() => setSelectedId("")}
        {...queryParams}/>

        </>
    );
}
