"use client";
import React, { useState, useEffect } from "react";
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
import { useAuth } from "@clerk/nextjs";

type Project = {
  uuid: string;
  name: string;
};

export default function AddSystemButton() {
  const { getToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    system_number: "",
    description: "",
    area: "",
    system_type: "",
    contractors: "",
    projectUuid: "", // link to project here
  });

  useEffect(() => {
    // Fetch projects when modal opens or component mounts
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects`
        );
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/systems`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            system_number: formData.system_number,
            description: formData.description,
            area: formData.area,
            system_type: formData.system_type,
            contractors: formData.contractors,
            projectUuid: formData.projectUuid, // send selected project UUID
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add system");
      }

      const result = await response.json();
      console.log("✅ System added:", result);

      setFormData({
        system_number: "",
        description: "",
        area: "",
        system_type: "",
        contractors: "",
        projectUuid: "",
      });

      setOpen(false);
    } catch (error) {
      console.error("❌ Error adding system:", error);
      // Optionally show an error toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="hover:cursor-pointer">
          <CirclePlus className="mr-2 h-4 w-4" />
          Add System
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New System</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new system and link it to a
            project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">System Number</label>
            <input
              type="text"
              value={formData.system_number}
              onChange={(e) =>
                setFormData({ ...formData, system_number: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Area</label>
            <input
              type="text"
              value={formData.area}
              onChange={(e) =>
                setFormData({ ...formData, area: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">System Type</label>
            <input
              type="text"
              value={formData.system_type}
              onChange={(e) =>
                setFormData({ ...formData, system_type: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Contractors</label>
            <input
              type="text"
              value={formData.contractors}
              onChange={(e) =>
                setFormData({ ...formData, contractors: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Project</label>
            <select
              value={formData.projectUuid}
              onChange={(e) =>
                setFormData({ ...formData, projectUuid: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md text-sm"
              required
            >
              <option value="" disabled>
                Select a project
              </option>
              {projects.map((project) => (
                <option key={project.uuid} value={project.uuid}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
