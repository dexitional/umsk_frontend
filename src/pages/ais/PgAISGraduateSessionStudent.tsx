import React, { useState, useEffect } from "react";
import { BsActivity, BsSearch, BsFilter } from "react-icons/bs";
import { useLoaderData, LoaderFunctionArgs } from "react-router-dom";
import AISGraduateStudentCard from "../../components/ais/AISGraduateStudentCard";
import Service from "../../utils/aisService";

// Custom hook to debounce fast-changing values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

type GraduateRow = {
  indexno?: string;
  cgpa?: string;
  class?: string;
  verified?: boolean;
  verifiedRemark?: string;
  student?: {
    fname?: string;
    lname?: string;
    indexno?: string;
    [key: string]: any;
  };
  [key: string]: any;
};

// [ programTitle, rows-for-that-program ] — grouped server-side in
// fetchGraduateSessionList, NOT a single student record.
type GraduateRecord = [string, GraduateRow[]];

interface LoaderData {
  data: GraduateRecord[] | null;
  gis: string;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await Service.fetchGraduateSessionList(params.sessionId ?? "");
  return { data, gis: params.sessionId ?? "" };
}

const STATUS_OPTIONS = ["Verified", "Unverified"];

function PgAISGraduateSessionStudent() {
  const { data } = useLoaderData() as LoaderData;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Debounce the search input by 300ms
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Master Filter Logic — filters the students WITHIN each program group,
  // then drops groups left with no matches. (Each group's second element
  // is an array of student rows, not a single student, so filtering has to
  // happen per-row, not on the group itself.)
  const filteredData: GraduateRecord[] = (data ?? [])
    .map(([title, rows]): GraduateRecord => {
      const matchingRows = (rows ?? []).filter((row) => {
        if (statusFilter !== "all") {
          const rowStatus = row?.verified ? "Verified" : "Unverified";
          if (rowStatus !== statusFilter) return false;
        }

        if (!debouncedSearchTerm) return true;

        const searchLower = debouncedSearchTerm.toLowerCase();
        return (
          title?.toLowerCase()?.includes(searchLower) ||
          row?.student?.lname?.toLowerCase()?.includes(searchLower) ||
          row?.student?.fname?.toLowerCase()?.includes(searchLower) ||
          row?.student?.indexno?.toLowerCase()?.includes(searchLower)
        );
      });
      return [title, matchingRows];
    })
    .filter(([, rows]) => rows.length > 0);

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8">
      {/* Controls Bar */}
      <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <BsSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/40" />
          <input
            type="text"
            placeholder="Search by name, index number, or program..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-primary/20 bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary/50"
          />
        </div>

        {/* Dropdown Selector */}
        <div className="relative min-w-[160px]">
          <BsFilter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/40" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none rounded-lg border border-primary/20 bg-transparent py-2 pl-10 pr-8 outline-none focus:border-primary/50"
          >
            <option value="all" className="text-black">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status} className="text-black">
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Records List */}
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10">
        {filteredData.map((graduateData, i) => (
          <AISGraduateStudentCard
            key={graduateData[0] || i}
            title={graduateData[0]}
            data={graduateData[1]}
            index={i}
          />
        ))}
        
        {/* Fallback View */}
        {filteredData.length === 0 ? (
          <div className="p-10 border border-primary/10 rounded-xl flex flex-col items-center justify-center space-y-3">
            <BsActivity className="h-20 w-20 text-primary/30 border rounded-md" />
            <span className="text-primary/40 font-medium">
              {searchTerm || statusFilter !== "all" 
                ? "No matching records found..." 
                : "No Graduate Records ..."}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PgAISGraduateSessionStudent;
