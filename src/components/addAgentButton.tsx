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

export default function AddAgentButton() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add agent");
      }

      const result = await response.json();
      console.log("✅ Agent added:", result);

      // Optionally reset the form
      setFormData({ name: "", surname: "", email: "" });

      // Close the modal
      setOpen(false);
    } catch (error) {
      console.error("❌ Error adding agent:", error);
      // Optionally show a toast notification or error message
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="hover:cursor-pointer">
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Agent
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new agent.
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
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Surname</label>
            <input
              type="text"
              value={formData.surname}
              onChange={(e) =>
                setFormData({ ...formData, surname: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-md text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="example@domain.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
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
