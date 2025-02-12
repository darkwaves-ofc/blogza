"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import PaginationCommon from "@/components/common/Dashboard/PaginationCommon";
import TableTopSearch from "@/components/common/Dashboard/TableTopSearch";
import { SearchSubjectsInfoSuccessType } from "@/types/subject";
import SubjectDataTable from "./SubjectDataTable";
import useSubjects from "./all-subject";

export default function Subjects({
  initialSubjects,
  subjectsPerPage,
  error,
}: {
  initialSubjects: SearchSubjectsInfoSuccessType;
  subjectsPerPage: number;
  error: React.ReactNode;
}) {
  const { isPending, handleDeleteSubject } = useSubjects(initialSubjects);
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <TableTopSearch
          title={"Subjects"}
          description={"Manage Subjects"}
        />
      </CardHeader>
      <CardContent>
        <SubjectDataTable
          initialSubjects={initialSubjects}
          isPending={isPending}
          subjectsPerPage={subjectsPerPage}
          handleDeleteSubject={handleDeleteSubject}
        />
      </CardContent>
      <CardFooter>
        <PaginationCommon error={error} />
      </CardFooter>
    </Card>
  );
}
