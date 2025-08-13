"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

type Project = {
  uuid: string;
  name: string;
};

type User = {
  uuid: string;
  name: string;
};

type ProjectUser = {
  uuid: string;
  user: User | null;
  project: Project | null;
  assigned_at: string; // ISO date
};

export default function ProjectUsersTable() {
  const { getToken } = useAuth();
  const [projectUsers, setProjectUsers] = React.useState<ProjectUser[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProjectUuid, setSelectedProjectUuid] = React.useState("");

  const fetchData = React.useCallback(async () => {
    try {
      const token = await getToken();

      const [projectsRes, projectUsersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projectuser`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!projectsRes.ok || !projectUsersRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const projectsData = await projectsRes.json();
      const projectUsersData = await projectUsersRes.json();

      setProjects(projectsData);
      setProjectUsers(projectUsersData);
    } catch (error) {
      console.error("Failed to fetch project users or projects:", error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projectuser/${uuid}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete assignment");
      }

      setProjectUsers((prev) => prev.filter((pu) => pu.uuid !== uuid));
      console.log("✅ Assignment deleted");
    } catch (error) {
      console.error("❌ Error deleting assignment:", error);
    }
  };

  const projectUserColumns: ColumnDef<ProjectUser>[] = [
    {
      id: "projectName",
      header: "Project",
      accessorFn: (row) => row.project?.name ?? "-",
    },
    {
      id: "userName",
      header: "User",
      accessorFn: (row) => row.user?.name ?? "-",
    },
    {
      accessorKey: "assigned_at",
      header: "Assigned At",
      cell: (info) => {
        const dateStr = info.getValue() as string;
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? "-" : date.toLocaleString();
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(row.original.uuid)}
          className="cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const filteredProjectUsers = selectedProjectUuid
    ? projectUsers.filter((pu) => pu.project?.uuid === selectedProjectUuid)
    : projectUsers;

  if (loading) return <Skeleton className="w-full px-6 py-2 h-48" />;

  return (
    <div className="w-full px-6 py-2 space-y-4">
      {/* Project Filter */}
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

      {/* Table */}
      <DataTable
        title="Project Users"
        description="Users assigned to projects"
        seeAllLink="/admin/dashboard/projectusers"
        seeAllText="See All Project Users"
        columns={projectUserColumns}
        data={filteredProjectUsers}
      />
    </div>
  );
}
