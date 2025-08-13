import AssignProjectToUserButton from "@/components/AssignProjectToUserButton";
import ProjectUsersTable from "@/components/projectsAssign";
import React from "react";

const ProjectAssign = () => {
  return (
    <div className="w-full px-6 py-2">
      <div className="w-full flex justify-between items px-6">
        <h1 className="text-2xl font-bold pb-4">Project Users Table</h1>
        <div className="flex gap-2">
          <AssignProjectToUserButton />
        </div>
        {/* <Button>
          <CirclePlus className="mr-2 h-4 w-4" />
          Add ProjectAssign
        </Button> */}
      </div>
      <ProjectUsersTable />
    </div>
  );
};

export default ProjectAssign;
