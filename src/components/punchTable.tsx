"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "@clerk/nextjs";
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
type System = { uuid: string; system_number: string };

type Punch = {
  uuid: string;
  title: string;
  description?: string | null;
  status: string;
  category?: string;
  image_url?: string | null;
  project?: Project | null;
  system?: System | null;
  created_by?: { name: string } | null;
  modified_by?: { name: string } | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const displayValue = (value: any) =>
  value === null || value === undefined || value === "" ? "NULL" : value;

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    OPEN: { label: "Open", color: "bg-red-200 text-red-800" },
    CLOSED: { label: "Closed", color: "bg-gray-200 text-gray-800" },
  };
  const statusInfo = statusMap[status] || {
    label: status,
    color: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}
    >
      {statusInfo.label}
    </span>
  );
};

export default function PunchTable() {
  const [punches, setPunches] = React.useState<Punch[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [systems, setSystems] = React.useState<System[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [selectedProjectUuid, setSelectedProjectUuid] = React.useState("");
  const [selectedSystemUuid, setSelectedSystemUuid] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [titleFilter, setTitleFilter] = React.useState("");
  const [editPunch, setEditPunch] = React.useState<Punch | null>(null);

  const { getToken } = useAuth();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const [projectsRes, punchesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/punches`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!projectsRes.ok || !punchesRes.ok)
          throw new Error("Failed to fetch data");

        setProjects(await projectsRes.json());
        setPunches(await punchesRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getToken]);

  // Update systems when project changes
  React.useEffect(() => {
    if (!selectedProjectUuid) {
      setSystems([]);
      setSelectedSystemUuid("");
      return;
    }
    const systemsForProject = punches
      .filter((p) => p.project?.uuid === selectedProjectUuid && p.system)
      .map((p) => p.system!) // non-null
      .reduce<System[]>((acc, system) => {
        if (!acc.some((s) => s.uuid === system.uuid)) acc.push(system);
        return acc;
      }, []);
    setSystems(systemsForProject);
    setSelectedSystemUuid("");
  }, [selectedProjectUuid, punches]);

  const filteredPunches = punches
    .filter((p) =>
      selectedProjectUuid ? p.project?.uuid === selectedProjectUuid : true
    )
    .filter((p) =>
      selectedSystemUuid ? p.system?.uuid === selectedSystemUuid : true
    )
    .filter((p) => (selectedStatus ? p.status === selectedStatus : true))
    .filter((p) =>
      titleFilter
        ? p.title.toLowerCase().includes(titleFilter.toLowerCase())
        : true
    );

  const handleEditPunch = async (updatedPunch: Punch) => {
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/punches/${updatedPunch.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedPunch),
        }
      );
      if (!res.ok) throw new Error("Failed to update punch");

      setPunches((prev) =>
        prev.map((p) => (p.uuid === updatedPunch.uuid ? updatedPunch : p))
      );
      setEditPunch(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePunch = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this punch?")) return;
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/punches/${uuid}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete punch");
      setPunches((prev) => prev.filter((p) => p.uuid !== uuid));
    } catch (err) {
      console.error(err);
    }
  };

  const columns: ColumnDef<Punch>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: (info) => displayValue(info.getValue()),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (info) => displayValue(info.getValue()),
    },
    {
      id: "projectName",
      header: "Project",
      accessorFn: (row) => row.project?.name ?? "-",
    },
    {
      id: "systemName",
      header: "System",
      accessorFn: (row) => row.system?.system_number ?? "-",
    },
    {
      id: "createdByName",
      header: "Created By",
      accessorFn: (row) => row.created_by?.name ?? "-",
    },
    {
      id: "modifiedByName",
      header: "Modified By",
      accessorFn: (row) => row.modified_by?.name ?? "-",
    },
    {
      id: "createdAt",
      header: "Created At",
      accessorFn: (row) => row.created_at ?? null,
      cell: (info) =>
        info.getValue()
          ? new Date(info.getValue() as string).toLocaleString()
          : "-",
    },
    {
      id: "updatedAt",
      header: "Updated At",
      accessorFn: (row) => row.updated_at ?? null,
      cell: (info) =>
        info.getValue()
          ? new Date(info.getValue() as string).toLocaleString()
          : "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditPunch(row.original)}
          >
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeletePunch(row.original.uuid)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <Skeleton className="w-full px-6 py-2 h-48 mb-6" />;

  return (
    <div className="w-full px-6 py-2 space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Project Filter */}
        <div className="flex-1 min-w-[200px]">
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

        {/* System Filter */}
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="systemFilter"
            className="block text-sm font-medium mb-1"
          >
            Filter by System
          </label>
          <select
            id="systemFilter"
            value={selectedSystemUuid}
            onChange={(e) => setSelectedSystemUuid(e.target.value)}
            className="w-full border px-3 py-2 rounded-md text-sm"
            disabled={!selectedProjectUuid || systems.length === 0}
          >
            <option value="">All Systems</option>
            {systems.map((system) => (
              <option key={system.uuid} value={system.uuid}>
                {system.system_number}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="statusFilter"
            className="block text-sm font-medium mb-1"
          >
            Filter by Status
          </label>
          <select
            id="statusFilter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border px-3 py-2 rounded-md text-sm"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Title Filter */}
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="titleFilter"
            className="block text-sm font-medium mb-1"
          >
            Filter by Title
          </label>
          <input
            type="text"
            id="titleFilter"
            placeholder="Enter punch title..."
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
        </div>
      </div>

      <DataTable
        title="Punches"
        description="Recent punches recorded"
        seeAllLink="/admin/dashboard/punches"
        seeAllText="See All Punches"
        columns={columns}
        data={filteredPunches}
      />

      {/* Edit Punch Modal */}
      {editPunch && (
        <Dialog open={!!editPunch} onOpenChange={() => setEditPunch(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Punch</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={editPunch.title}
                  onChange={(e) =>
                    setEditPunch({ ...editPunch, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Input
                  value={editPunch.description || ""}
                  onChange={(e) =>
                    setEditPunch({ ...editPunch, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <Select
                  value={editPunch.category || ""}
                  onValueChange={(val) =>
                    setEditPunch({ ...editPunch, category: val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={editPunch.status}
                  onValueChange={(val) =>
                    setEditPunch({ ...editPunch, status: val })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project
                </label>
                <Select
                  value={editPunch.project?.uuid || ""}
                  onValueChange={(val) =>
                    setEditPunch({
                      ...editPunch,
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
              <Button onClick={() => editPunch && handleEditPunch(editPunch)}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
