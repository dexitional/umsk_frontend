import { useQuery } from "@tanstack/react-query";
import Service from "./evsService";

// Mirrors the backend's own two-tier check (requireElectionAdmin /
// isElectionAdmin): platform `election::admin` role OR listed in this
// specific election's `admins`. Checking only the platform role here would
// hide Add/Edit/Delete actions from legitimate per-election admins even
// though the backend would accept their request.
export function useIsElectionAdmin(electionId?: string | number) {
  const { data } = useQuery({
    queryKey: ["election-admin-check", electionId],
    queryFn: () => Service.checkElectionAdmin(electionId!),
    enabled: !!electionId,
  });
  return !!data?.isAdmin;
}
