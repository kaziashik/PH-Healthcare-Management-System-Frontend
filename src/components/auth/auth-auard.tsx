"use client"

import { useGetMe } from "@/hooks/auth.hook";
import { useRouter } from "next/navigation";

import { ReactNode, useEffect } from "react";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter()

    const { data, isPending, isError } = useGetMe();

    // console.log(data);

    const user = data?.data

    useEffect(() => {
        if(isPending){
            return
        }
        if (isError || !user) {
            router.replace("/login")
        }

    }, [isPending,isError, user])

    if(isPending){
        return <AuthLoading/>
    }

    if (isError || !user) {
            return <AuthLoading label=" Redirecting..."/>
        }

    return <>{children}</>;
}
