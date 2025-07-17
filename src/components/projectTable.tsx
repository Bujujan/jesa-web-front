// components/ProjectTable.tsx
"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Skeleton } from "./ui/skeleton";

type Project = {
  id: number;
  name: string;
  description: string;
  createdAt?: string | null;
};

const projectColumns: ColumnDef<Project>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
    },
  },
];

export default function ProjectTable() {
  const [data, setData] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/projects"); // change to your real API endpoint
        const projects = await res.json();
        setData(projects);
        console.log("Projects API response:", projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <Skeleton className="w-full px-6 py-2 h-48" />;

  return (
    <div className="w-full px-6 py-2">
      <DataTable
        title="Projects"
        description="Projects you have worked on"
        seeAllLink="/admin/dashboard/projets" // update if needed
        seeAllText="See All Projects"
        columns={projectColumns}
        data={data}
      />
    </div>
  );
}
