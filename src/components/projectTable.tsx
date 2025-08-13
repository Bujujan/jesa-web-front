"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
// import { Textarea } from "./ui/input";

type Project = {
  id: number;
  name: string;
  description: string;
  createdAt?: string | null;
};

export default function ProjectTable() {
  const [data, setData] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [editOpen, setEditOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    id: 0,
    name: "",
    description: "",
  });

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`
      );
      const projects = await res.json();
      setData(projects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete project");
      setData((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("❌ Error deleting project:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${editForm.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editForm.name,
            description: editForm.description,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update project");

      // Update in UI
      setData((prev) =>
        prev.map((p) =>
          p.id === editForm.id
            ? { ...p, name: editForm.name, description: editForm.description }
            : p
        )
      );
      setEditOpen(false);
    } catch (error) {
      console.error("❌ Error updating project:", error);
    }
  };

  const projectColumns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: "Group Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setEditForm({
                id: row.original.id,
                name: row.original.name,
                description: row.original.description,
              });
              setEditOpen(true);
            }}
            className="cursor-pointer"
          >
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
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
    <div className="w-full px-6 py-2">
      <DataTable
        title="Projects"
        description="Projects you have worked on"
        seeAllLink="/admin/dashboard/projets"
        seeAllText="See All Projects"
        columns={projectColumns}
        data={data}
      />

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              placeholder="Project name"
            />
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md text-sm"
              rows={4}
              required
            />
          </div>
          <DialogFooter>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
