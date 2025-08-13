import AddProjectButton from "@/components/AddProjectButton";
import AddPunchButton from "@/components/AddPunchButton";
import AssignProjectToUserButton from "@/components/AssignProjectToUserButton";
import ProjectTable from "@/components/projectTable";
import PunchTable from "@/components/punchTable";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import React from "react";

const Projet = () => {
  return (
    <div className="w-full px-6 py-2">
      <div className="w-full flex justify-between items px-6">
        <h1 className="text-2xl font-bold pb-4">Projects</h1>
        <div className="flex gap-2">
          <AddProjectButton />
          <AssignProjectToUserButton />
        </div>
        {/* <Button>
          <CirclePlus className="mr-2 h-4 w-4" />
          Add Projet
        </Button> */}
      </div>
      <ProjectTable />
    </div>
  );
};

export default Projet;
