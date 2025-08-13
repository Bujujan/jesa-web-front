"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Skeleton } from "./ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Pencil, Trash2 } from "lucide-react";

type Project = { uuid: string; name: string };
type System = {
  uuid: string;
  system_number: string;
  description: string;
  area: string;
  system_type: string;
  contractors: string;
  project: Project | null;
};

export default function SystemTable() {
  const { getToken } = useAuth();
  const [systems, setSystems] = React.useState<System[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProjectUuid, setSelectedProjectUuid] = React.useState("");
  const [editSystem, setEditSystem] = React.useState<System | null>(null);

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
        if (!projectsRes.ok || !systemsRes.ok)
          throw new Error("Failed to fetch data");
        setProjects(await projectsRes.json());
        setSystems(await systemsRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getToken]);

  const filteredSystems = selectedProjectUuid
    ? systems.filter((sys) => sys.project?.uuid === selectedProjectUuid)
    : systems;

  const handleEditSystem = async (updatedSystem: System) => {
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/systems/${updatedSystem.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedSystem),
        }
      );
      if (!res.ok) throw new Error("Failed to update system");
      setSystems((prev) =>
        prev.map((s) => (s.uuid === updatedSystem.uuid ? updatedSystem : s))
      );
      setEditSystem(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSystem = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this system?")) return;
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/systems/${uuid}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete system");
      setSystems((prev) => prev.filter((s) => s.uuid !== uuid));
    } catch (err) {
      console.error(err);
    }
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
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditSystem(row.original)}
            className="cursor-pointer"
          >
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteSystem(row.original.uuid)}
            className="cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

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

      {/* System Table */}
      <DataTable
        title="Systems"
        description="Systems filtered by project"
        seeAllLink="/admin/dashboard/systems"
        seeAllText="See All Systems"
        columns={systemColumns}
        data={filteredSystems}
      />

      {/* Edit System Modal */}
      {editSystem && (
        <Dialog open={!!editSystem} onOpenChange={() => setEditSystem(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit System</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* System Number */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  System Number
                </label>
                <Input
                  value={editSystem.system_number}
                  onChange={(e) =>
                    setEditSystem({
                      ...editSystem,
                      system_number: e.target.value,
                    })
                  }
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Input
                  value={editSystem.description}
                  onChange={(e) =>
                    setEditSystem({
                      ...editSystem,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              {/* Area */}
              <div>
                <label className="block text-sm font-medium mb-1">Area</label>
                <Input
                  value={editSystem.area}
                  onChange={(e) =>
                    setEditSystem({ ...editSystem, area: e.target.value })
                  }
                />
              </div>
              {/* System Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  System Type
                </label>
                <Input
                  value={editSystem.system_type}
                  onChange={(e) =>
                    setEditSystem({
                      ...editSystem,
                      system_type: e.target.value,
                    })
                  }
                />
              </div>
              {/* Contractors */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contractors
                </label>
                <Input
                  value={editSystem.contractors}
                  onChange={(e) =>
                    setEditSystem({
                      ...editSystem,
                      contractors: e.target.value,
                    })
                  }
                />
              </div>
              {/* Project */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project
                </label>
                <Select
                  value={editSystem.project?.uuid || ""}
                  onValueChange={(val) =>
                    setEditSystem({
                      ...editSystem,
                      project: projects.find((p) => p.uuid === val) || null,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.uuid} value={p.uuid}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => editSystem && handleEditSystem(editSystem)}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
