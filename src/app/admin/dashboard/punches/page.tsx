import PunchTable from "@/components/punchTable";
import { Button } from "@/components/ui/button";
import React from "react";

const Punch = () => {
  return (
    <div className="w-full px-6 py-2">
      <div className="w-full flex flex-col">
        <h1 className="text-2xl font-bold pl-10 pb-4">Punches</h1>
      </div>
      <PunchTable />
    </div>
  );
};

export default Punch;
