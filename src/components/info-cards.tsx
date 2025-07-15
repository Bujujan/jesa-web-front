"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionCards } from "./section-cards";

const InfoCards = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/punches/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("✅ API data:", data);
        setStats({
          ...data,
          trend: {
            total: 5,
            new: 2,
            resolved: 3,
            pending: -1,
          },
        });
      })
      .catch((err) => {
        console.error("❌ Failed to fetch stats:", err);
        setStats(null); // still render fallback UI
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // 1. While loading → show skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="w-full h-48" />
        ))}
      </div>
    );
  }

  // 2. After loading → always show SectionCards (even with no results)
  return <SectionCards punchStats={stats} />;
};

export default InfoCards;
