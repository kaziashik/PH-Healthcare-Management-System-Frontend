import { LoaderIcon } from "lucide-react";

export default function AuthLoading({label="Verifying Account"}: {label?:string} ) {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex gap-5">
        <LoaderIcon className="size-6 animate-spin">
      </LoaderIcon>
      {label}
      </div>
    </div>
  );
}
