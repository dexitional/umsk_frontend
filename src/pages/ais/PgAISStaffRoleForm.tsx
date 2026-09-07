import React, { useState } from "react";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import Service from "../../utils/aisService";
import { toast } from "react-hot-toast";

type Props = {};

export async function action({ request, params }) {
  const staffId = params?.staffId || 0;
  const formData = await request.formData();
  
  // Extract checked role IDs from form submission
  const selectedRoleIds = formData.getAll("appRoleIds").map(Number);
  const roleMeta = formData.get("roleMeta") || "SSO Administrator Direct Update";

  // Fetch current user roles to run differential diffing
  const [currentlyAssigned, globalRoles] = await Promise.all([
    Service.fetchUserRolesById(staffId),
    Service.fetchAppRoleList(),
  ]);
  const currentRoleIds = (currentlyAssigned || []).map((ur: any) => ur.roleId);

  // A staff member can only hold one role per module. Catch a same-module
  // double-selection here, before any network call, rather than letting two
  // concurrent creates race the backend's own module check.
  const moduleByRoleId = new Map<number, string>(
    ((globalRoles as any[]) || []).map((r: any) => [r.roleId, r.module])
  );
  const selectedModules = new Map<string, string>();
  for (const roleId of selectedRoleIds) {
    const moduleTag: string | undefined = moduleByRoleId.get(roleId);
    if (!moduleTag) continue;
    if (selectedModules.has(moduleTag)) {
      toast.error(
        `Only one role per module is allowed. You selected more than one role in the "${moduleTag}" module — pick a single role there and try again.`
      );
      return null;
    }
    selectedModules.set(moduleTag, String(roleId));
  }

  // Compute what needs adding vs what needs dropping
  const rolesToAdd = selectedRoleIds.filter(id => !currentRoleIds.includes(id));
  const rolesToRemove = (currentlyAssigned || []).filter(
    (ur: any) => !selectedRoleIds.includes(ur.roleId)
  );

  try {
    // Drops must land before creates: when swapping roles within the same
    // module (e.g. student::clerk -> student::admin), the backend rejects a
    // duplicate assignment. Running both concurrently races the add against
    // the still-pending remove of the old role, so remove first and await it.
    await Promise.all(rolesToRemove.map((ur: any) => Service.deleteUserRole(ur.id, true)));

    await Promise.all(rolesToAdd.map(id =>
      Service.postUserRole({
        staffNo: staffId,
        appRoleId: id,
        roleMeta: roleMeta
      }, true)
    ));

    if (rolesToAdd.length || rolesToRemove.length) {
      toast.success("User roles updated");
    }

    return redirect(`/ais/staff/${encodeURIComponent(staffId)}/roles`);
  } catch (error: any) {
    console.error(error);
    const serverMessage = error?.response?.data?.message;
    toast.error(serverMessage || "Failed to safely alter application permissions configuration matrix.");
    return null;
  }
}

export async function loader({ params }) {
  const staffId = params?.staffId || 0;
  
  const [globalRoles, userAssignedData] = await Promise.all([
    Service.fetchAppRoleList(),
    Service.fetchUserRolesById(staffId)
  ]);

  return { 
    globalRoles: Array.isArray(globalRoles) ? globalRoles : [], 
    assignedRoles: Array.isArray(userAssignedData) ? userAssignedData : [] 
  };
}

function PgAISStaffRoleForm({}: Props) {
  const navigate = useNavigate();
  const { globalRoles, assignedRoles }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation?.state;

  const [metaText, setMetaText] = useState("SSO Administrator Direct Update");

  // Instantly cross-reference active items using your updated backend key 'roleId'
  const assignedRoleIdsSet = new Set(
    assignedRoles.map((ur: any) => ur.roleId)
  );

  // Build a multi-tier group structure layout object: App -> Module -> Roles
  const systemsMap: Record<string, Record<string, any[]>> = {};

  globalRoles.forEach((item: any) => {
    const appKey = item.app?.toUpperCase() || "CORE SERVICE";
    const moduleKey = item.module?.toUpperCase() || "BASE PERMISSIONS";

    if (!systemsMap[appKey]) systemsMap[appKey] = {};
    if (!systemsMap[appKey][moduleKey]) systemsMap[appKey][moduleKey] = [];
    
    systemsMap[appKey][moduleKey].push(item);
  });

  return (
    <main className="p-2 md:py-4 w-full">
      
        <section className="mb-4 flex flex-col space-y-1">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">
            System Roles Assignmnent
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Grant or revoke user access & capabilities across platforms.
          </p>
        </section>

        <Form method="post" className="space-y-6">
          {/* Dynamic Systems Loop Matrix */}
          <div className="space-y-6">
            {Object.entries(systemsMap).map(([appName, modules]) => (
              <div key={appName} className="p-4 md:p-5 border rounded-xl bg-white shadow-sm space-y-4">
                <div className="border-b pb-2">
                  <h2 className="text-sm font-bold text-slate-800 tracking-wider uppercase flex items-center">
                    <span className="mr-2">🖥️</span> System Platform: {appName}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(modules).map(([moduleName, roles]) => (
                    <div key={moduleName} className="p-3 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 space-y-3">
                      <h3 className="text-xs font-bold font-noto text-primary/80 uppercase tracking-wider flex items-center">
                        <span className="mr-1.5">📦</span> Module: {moduleName}
                      </h3>

                      <div className="space-y-2">
                        {roles.map((role: any) => {
                          const isInitiallyChecked = assignedRoleIdsSet.has(role.roleId);
                          return (
                            <label key={role.roleId} className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-white rounded-md border border-transparent hover:border-slate-200/60 transition-all">
                              <input
                                type="checkbox"
                                name="appRoleIds"
                                value={role.roleId}
                                defaultChecked={isInitiallyChecked}
                                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
                              />
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-slate-700 italic">
                                  {role.role}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {role.roleDesc || "No description provided"}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Verification Control Bar */}
          <div className="p-4 md:p-6 border rounded-xl bg-white flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex-1 max-w-sm">
              <label className="flex flex-col space-y-1.5">
                <span className="text-xs text-slate-500 font-semibold uppercase">Tracking Metadata Context</span>
                <input
                  aria-label="roleMeta"
                  name="roleMeta"
                  type="text"
                  value={metaText}
                  onChange={(e) => setMetaText(e.target.value)}
                  className="focus:ring-2 focus:ring-primary/20 border border-slate-300 px-3 py-1.5 text-xs text-slate-600 rounded-md bg-slate-50"
                />
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <button
                disabled={loading === "submitting"}
                className="py-2 px-5 rounded-md bg-primary/80 hover:bg-primary text-white text-xs font-semibold shadow disabled:opacity-50 min-w-[130px] transition-colors"
                type="submit"
              >
                {loading === "submitting" ? (
                  <span className="animate-pulse">SAVING CHANGELOG...</span>
                ) : (
                  "SAVE ASSIGNMENTS"
                )}
              </button>
              <button
                disabled={loading === "submitting"}
                onClick={() => {
                  if (confirm("Discard modifications?")) navigate(-1);
                }}
                className="py-2 px-4 rounded-md bg-slate-50 hover:bg-slate-100 border text-xs text-slate-600 transition-colors"
                type="button"
              >
                CANCEL
              </button>
            </div>
          </div>
        </Form>
     
    </main>
  );
}

export default PgAISStaffRoleForm;
