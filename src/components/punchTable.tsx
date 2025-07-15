"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Skeleton } from "./ui/skeleton";

type Punch = {
  id: number;
  title: string;
  description?: string | null;
  status: string; // e.g. "OPEN", "IN_PROGRESS", "RESOLVED"
  projectId?: string | null;
  createdByName?: string | null;
  modifiedByName?: string | null;
  createdAt?: string | null; // ISO date string
  updatedAt?: string | null;
};

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED"];

const displayValue = (value: any) =>
  value === null || value === undefined || value === "" ? "NULL" : value;

// StatusBadge component for colored badges
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    OPEN: { label: "Open", color: "bg-red-200 text-red-800" },
    IN_PROGRESS: {
      label: "In Progress",
      color: "bg-yellow-200 text-yellow-800",
    },
    RESOLVED: { label: "Resolved", color: "bg-green-200 text-green-800" },
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
  const [data, setData] = React.useState<Punch[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPunches = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/punches/dto");
        const punches = await res.json();
        setData(punches);
      } catch (error) {
        console.error("Failed to fetch punches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPunches();
  }, []);

  // Note: updateStatus function kept for completeness if needed in future
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/punches/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setData((oldData) =>
        oldData.map((punch) =>
          punch.id === id ? { ...punch, status: newStatus } : punch
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
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
      accessorKey: "projectId",
      header: "Project ID",
      cell: (info) => displayValue(info.getValue()),
    },
    {
      accessorKey: "createdByName",
      header: "Created By",
      cell: (info) => displayValue(info.getValue()),
    },
    {
      accessorKey: "modifiedByName",
      header: "Modified By",
      cell: (info) => displayValue(info.getValue()),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: (info) =>
        info.getValue()
          ? new Date(info.getValue() as string).toLocaleString()
          : "NULL",
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: (info) =>
        info.getValue()
          ? new Date(info.getValue() as string).toLocaleString()
          : "NULL",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },
  ];

  if (loading) return <Skeleton className="w-full px-6 py-2 h-48 mb-6" />;

  return (
    <div className="w-full px-6 py-2">
      <DataTable
        title="Punches"
        description="Recent punches recorded"
        seeAllLink="/admin/dashboard/punches"
        seeAllText="See All Punches"
        columns={columns}
        data={data}
      />
    </div>
  );
}
