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
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Pencil, Trash2 } from "lucide-react";

type User = {
  uuid: string; // changed from id to uuid
  name: string;
  surname?: string;
  email: string;
  role: "Commissioning" | "Completion";
};

export default function UserTable() {
  const { getToken } = useAuth();
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editUser, setEditUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        setUsers(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getToken]);

  // --- EDIT USER ---
  const handleEditUser = async (updatedUser: User) => {
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${updatedUser.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );
      if (!res.ok) throw new Error(await res.text());

      setUsers((prev) =>
        prev.map((u) => (u.uuid === updatedUser.uuid ? updatedUser : u))
      );
      setEditUser(null);
    } catch (err: any) {
      console.error("❌ Error updating user:", err.message || err);
      alert(err.message || "Failed to update user");
    }
  };

  // --- DELETE USER ---
  const handleDeleteUser = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${uuid}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(await res.text());

      setUsers((prev) => prev.filter((u) => u.uuid !== uuid));
    } catch (err: any) {
      console.error("❌ Error deleting user:", err.message || err);
      alert(err.message || "Failed to delete user");
    }
  };

  const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditUser(row.original)}
            className="cursor-pointer"
          >
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteUser(row.original.uuid)}
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
      <DataTable
        title="Users"
        description="Registered users"
        seeAllLink="/admin/dashboard/users"
        seeAllText="See All Users"
        columns={columns}
        data={users}
      />

      {/* Edit User Modal */}
      {editUser && (
        <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <Select
                  value={editUser.role}
                  onValueChange={(val) =>
                    setEditUser({
                      ...editUser,
                      role: val as "Commissioning" | "Completion",
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Commissioning">Commissioning</SelectItem>
                    <SelectItem value="Completion">Completion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => editUser && handleEditUser(editUser)}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
