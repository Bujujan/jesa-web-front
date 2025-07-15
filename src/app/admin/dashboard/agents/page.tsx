import AddAgentButton from "@/components/addAgentButton";
import UserTable from "@/components/userTable";
import React from "react";

const Agents = () => {
  return (
    <div className="w-full px-6 py-2">
      <div className="w-full flex justify-between items px-6">
        <h1 className="text-2xl font-bold pb-4">Agents</h1>
        <AddAgentButton />
      </div>
      <UserTable />
    </div>
  );
};

export default Agents;
