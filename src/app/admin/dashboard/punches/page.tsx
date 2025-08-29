import AddPunchButton from "@/components/AddPunchButton";
import PunchTable from "@/components/punchTable";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import React from "react";

const Punch = () => {
  return (
    <div className="w-full px-6 py-2">
      <div className="w-full flex justify-between items px-6">
        <h1 className="text-2xl font-bold pb-4">Punches</h1>
        {/* <AddPunchButton /> */}
        {/* <Button>
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Punch
        </Button> */}
      </div>
      <PunchTable />
    </div>
  );
};

export default Punch;
