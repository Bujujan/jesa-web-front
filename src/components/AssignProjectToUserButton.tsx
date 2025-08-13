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

type User = {
  uuid: string;
  name: string;
  email: string;
};

type Project = {
  uuid: string;
  name: string;
};

export default function AssignProjectToUserButton() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    userUuid: "",
    projectUuid: "",
  });

  // Fetch users and projects when modal opens
  useEffect(() => {
    if (!open) return; // only fetch when modal opens

    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`
        );
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

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

    fetchUsers();
    fetchProjects();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projectusers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userUuid: formData.userUuid,
            projectUuid: formData.projectUuid,
            assigned_at: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign project to user");
      }

      const result = await response.json();
      console.log("✅ Assigned project to user:", result);

      setFormData({ userUuid: "", projectUuid: "" });
      setOpen(false);
    } catch (error) {
      console.error("❌ Error assigning project:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="hover:cursor-pointer">
          <CirclePlus className="mr-2 h-4 w-4" />
          Assign Project to User
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Project to User</DialogTitle>
          <DialogDescription>
            Select a user and a project to assign.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">User</label>
            <select
              value={formData.userUuid}
              onChange={(e) =>
                setFormData({ ...formData, userUuid: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md text-sm"
              required
            >
              <option value="" disabled>
                Select a user
              </option>
              {users.map((user) => (
                <option key={user.uuid} value={user.uuid}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
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
            <Button type="submit">Assign</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
