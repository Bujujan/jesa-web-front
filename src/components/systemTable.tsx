"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Skeleton } from "./ui/skeleton";

type Project = {
  uuid: string;
  name: string;
};

type System = {
  uuid: string;
  system_number: string;
  description: string;
  area: string;
  system_type: string;
  contractors: string;
  project: Project | null;
};

const systemColumns: ColumnDef<System>[] = [
  { accessorKey: "system_number", header: "System Number" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "area", header: "Area" },
  { accessorKey: "system_type", header: "System Type" },
  { accessorKey: "contractors", header: "Contractors" },
  {
    id: "projectName",
    header: "Project",
    accessorFn: (row) => row.project?.name ?? "-",
    cell: (info) => info.getValue(),
  },
];

export default function SystemTable() {
  const { getToken } = useAuth();
  const [systems, setSystems] = React.useState<System[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProjectUuid, setSelectedProjectUuid] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();

        const [projectsRes, systemsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/systems`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!projectsRes.ok || !systemsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const projectsData = await projectsRes.json();
        const systemsData = await systemsRes.json();

        setProjects(projectsData);
        setSystems(systemsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken]);

  const filteredSystems = selectedProjectUuid
    ? systems.filter((sys) => sys.project?.uuid === selectedProjectUuid)
    : systems;

  if (loading) return <Skeleton className="w-full px-6 py-2 h-48" />;

  return (
    <div className="w-full px-6 py-2 space-y-4">
      <div>
        <label
          htmlFor="projectFilter"
          className="block text-sm font-medium mb-1"
        >
          Filter by Project
        </label>
        <select
          id="projectFilter"
          value={selectedProjectUuid}
          onChange={(e) => setSelectedProjectUuid(e.target.value)}
          className="w-full border px-3 py-2 rounded-md text-sm"
        >
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project.uuid} value={project.uuid}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        title="Systems"
        description="Systems filtered by project"
        seeAllLink="/admin/dashboard/systems"
        seeAllText="See All Systems"
        columns={systemColumns}
        data={filteredSystems}
      />
    </div>
  );
}
