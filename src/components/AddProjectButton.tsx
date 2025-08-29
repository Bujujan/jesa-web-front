"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";

export default function AddProjectButton() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sector: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Fetch existing projects
      const existingResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`
      );

      if (!existingResponse.ok) {
        throw new Error("Failed to fetch existing projects");
      }

      const existingProjects = await existingResponse.json();

      // Check for duplicate name (case-insensitive)
      const nameExists = existingProjects.some(
        (project: { name: string }) =>
          project.name.toLowerCase() === formData.name.toLowerCase()
      );

      if (nameExists) {
        setError("❌ A project with this name already exists.");
        return;
      }

      // Submit the new project
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add project");
      }

      const result = await response.json();
      console.log("✅ Project added:", result);

      // Reset form and close dialog
      setFormData({ name: "", description: "", sector: "" });
      setOpen(false);
    } catch (err) {
      console.error("❌ Error adding project:", err);
      setError("❌ Something went wrong while adding the project.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="hover:cursor-pointer">
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Fill in the information to create a new project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md text-sm"
              required
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md text-sm"
              rows={4}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Sector</label>
            <input
              type="text"
              value={formData.sector}
              onChange={(e) =>
                setFormData({ ...formData, sector: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md text-sm"
              required
            />
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
