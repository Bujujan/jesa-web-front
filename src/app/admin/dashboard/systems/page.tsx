import AddSystemButton from "@/components/AddSystemButton";
import SystemTable from "@/components/systemTable";
import React from "react";

const System = () => {
  return (
    <div className="w-full px-6 py-2">
      <div className="w-full flex justify-between items px-6">
        <h1 className="text-2xl font-bold pb-4">Systems</h1>
        <AddSystemButton />
      </div>
      <SystemTable />
    </div>
  );
};

export default System;
