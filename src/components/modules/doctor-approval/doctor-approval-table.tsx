import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DoctorReviewSheet from "./doctor-review-sheet";


export default function DoctorApprovalTable() {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Mir Hussain</TableCell>
            <TableCell className="text-right">
              <DoctorReviewSheet />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
