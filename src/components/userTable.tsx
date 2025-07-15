// components/UserTable.tsx
"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Skeleton } from "./ui/skeleton";

type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "surname",
    header: "Surname",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

export default function UserTable() {
  const [data, setData] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/users");
        const users = await res.json();
        setData(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <Skeleton className="w-full px-6 py-2 h-48" />;

  return (
    <div className="w-full px-6 py-2">
      <DataTable
        title="Users"
        description="Users registered to the app"
        seeAllLink="/agents"
        seeAllText="See All Agents"
        columns={columns}
        data={data}
      />
    </div>
  );
}
