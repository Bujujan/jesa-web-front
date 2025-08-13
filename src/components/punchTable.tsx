"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "@clerk/nextjs";

type Punch = {
  uuid: string;
  title: string;
  description?: string | null;
  status: string;
  category?: string;
  image_url?: string | null;
  project?: {
    uuid: string;
    name: string;
    // ... other fields if needed
  } | null;
  created_by?: {
    name: string;
  } | null;
  modified_by?: {
    name: string;
  } | null;
  created_at?: string | null; // ISO date string
  updated_at?: string | null;
};

const displayValue = (value: any) =>
  value === null || value === undefined || value === "" ? "NULL" : value;

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

  // Get Clerk auth helpers
  const { getToken } = useAuth();

  React.useEffect(() => {
    const fetchPunches = async () => {
      try {
        // Get Clerk JWT token
        const token = await getToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/punches`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch punches: ${res.status}`);
        }

        const punches = await res.json();
        setData(punches);
        console.log("Fetched punches:", punches); // Debug log
      } catch (error) {
        console.error("Failed to fetch punches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPunches();
  }, [getToken]);

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
      id: "projectUuid",
      header: "Project ID",
      accessorFn: (row) => row.project?.uuid ?? "-",
      cell: (info) => info.getValue(),
    },
    {
      id: "createdByName",
      header: "Created By",
      accessorFn: (row) => row.created_by?.name ?? "-",
      cell: (info) => info.getValue(),
    },
    {
      id: "modifiedByName",
      header: "Modified By",
      accessorFn: (row) => row.modified_by?.name ?? "-",
      cell: (info) => info.getValue(),
    },
    {
      id: "createdAt",
      header: "Created At",
      accessorFn: (row) => row.created_at ?? null,
      cell: (info) => {
        const dateStr = info.getValue() as string | null;
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? "-" : date.toLocaleString();
      },
    },
    {
      id: "updatedAt",
      header: "Updated At",
      accessorFn: (row) => row.updated_at ?? null,
      cell: (info) => {
        const dateStr = info.getValue() as string | null;
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? "-" : date.toLocaleString();
      },
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
