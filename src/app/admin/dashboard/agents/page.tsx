import UserTable from "@/components/userTable";
import React from "react";

const Agents = () => {
  return (
    <div className="w-full px-6 py-2">
      <h1 className="text-2xl font-bold pl-10 pb-4">Agents</h1>
      <UserTable />
    </div>
  );
};

export default Agents;
