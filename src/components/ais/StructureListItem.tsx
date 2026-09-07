import React from "react";
import { FaTrash } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
// @ts-ignore
import { Form, Link } from "react-router-dom";
import { useHasRole } from "../../utils/roles";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function StructureListItem({ data }: Props) {
  const canEditStructure = useHasRole("ais", ["curriculum::admin"]);

  return (
    <div className="px-3 md:px-6 pb-4 grid md:grid-cols-8 gap-y-4 md:gap-y-0 md:gap-x-2 md:place-items-center text-gray-500 border-b border-slate-200 hover:bg-slate-50/50 group">
      <div className="md:col-span-2 md:place-self-start flex flex-col space-y-2">
        <ListHeading title="Program" />
        <div className="px-2 md:px-0 flex items-center space-x-3 md:space-x-4">
          <span>{data.program?.longName}</span>
        </div>
      </div>
      <div className="md:col-span-2  md:place-self-start capitalize flex flex-col space-y-2">
        <ListHeading title="Course" />
        <span className="px-2 md:px-0">
          {data?.course?.title?.toUpperCase()}
        </span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Code " />
        <span className="px-2 md:px-0">{data?.courseId}</span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Semester" />
        <span className="px-2 md:px-0">
          L {Math.ceil(data?.semesterNum / 2) * 100}, SEM{" "}
          {data?.semesterNum % 2 == 0 ? 2 : 1}
        </span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Type" />
        <span className="px-2 md:px-0">
          {data?.type == "C"
            ? "COMPULSORY"
            : data?.type == "E"
            ? "ELECTIVE"
            : "OPTIONAL"}
        </span>
      </div>
      <div className="flex flex-col space-y-2">
        <ListHeading title="Action" />
        <div className="px-2 md:px-0 w-fit flex items-center justify-evenly space-x-2">
          {/* <Link to={`${encodeURIComponent(data?.id)}/curriculum`} className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50">
                    <FcViewDetails className="h-4 w-4 text-white"/>
                    <span className="hidden text-sm text-white font-semibold">View</span>
                </Link> */}
          {canEditStructure ? (
            <>
              <Link
                to={`${encodeURIComponent(data?.id)}/edit`}
                className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50"
              >
                <MdEditDocument className="h-4 w-4 text-green-100" />
                <span className="hidden text-sm text-white font-semibold">
                  Edit
                </span>
              </Link>
              <Form
                method="post"
                action={`${encodeURIComponent(data?.id)}/destroy`}
                onSubmit={(e) => {
                  if (!confirm("Do you want to delete")) e.preventDefault();
                  return false;
                }}
                className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50"
              >
                <FaTrash className="h-4 w-4 text-pink-100" />
                <button
                  type="submit"
                  className="hidden text-sm text-white font-semibold"
                >
                  Delete
                </button>
              </Form>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default StructureListItem;
