import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className=" w-full h-screen flex justify-center items-center">
        <div className="flex gap-3">
        <div className=" bg-red-200 rounded-full p-4">
            <ShieldAlert className=" size-8 text-red-500"/>
        </div>
      <h1  className="text-lg  font-semibold"> you do nto have access to this page</h1>
      <p> GO back to <Link href="/" className="underline">Home</Link></p>
    </div>
    </div>
  );
}
