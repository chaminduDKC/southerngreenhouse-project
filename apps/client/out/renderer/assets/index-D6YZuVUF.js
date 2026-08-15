import { u as useQuery, c as createClient, a as updateClient, d as deleteClient, b as createInventoryItem, e as updateInventoryItem, f as deleteInventoryItem, h as allocateInventory, i as createProject, j as updateProject, k as deleteProject, m as markProjectUsed, l as createSubProject, n as updateSubProject, o as deleteSubProject, p as markSubProjectUsed, q as createChildProject, r as updateChildProject, s as deleteChildProject, t as markChildProjectUsed, v as createLedgerEntry, w as updateLedgerEntry, x as deleteLedgerEntry, y as getDashboardStats, z as getClients, A as getInventory, B as getEligibleAllocationTargets, C as getProjects, D as getProject, E as getProjectAllocations, F as getSubProject, G as getSubProjectAllocations, H as getChildProject, I as getChildProjectAllocations, J as getLedger, K as getLedgerEntry, L as getLastLedgerEntry, M as getWorkers } from "./index-MsCQlR0B.js";
import { d as useQueryClient } from "./index-BvumJaAs.js";
import { u as useMutation } from "./useMutation-GA9qKVkW.js";
const useDashboardStats = () => useQuery({ queryKey: ["dashboard"], queryFn: getDashboardStats });
const useClients = (search) => useQuery({ queryKey: ["clients", search], queryFn: () => getClients(search) });
const useCreateClient = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createClient, onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }) });
};
const useUpdateClient = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => updateClient(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }) });
};
const useDeleteClient = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteClient, onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }) });
};
const useInventory = (search) => useQuery({ queryKey: ["inventory", search], queryFn: () => getInventory(search) });
const useCreateInventoryItem = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createInventoryItem, onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory"] }) });
};
const useUpdateInventoryItem = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => updateInventoryItem(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory"] }) });
};
const useDeleteInventoryItem = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteInventoryItem, onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory"] }) });
};
const useEligibleAllocationTargets = () => useQuery({ queryKey: ["inventory-targets"], queryFn: getEligibleAllocationTargets });
const useAllocateInventory = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: allocateInventory, onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["inventory"] });
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  } });
};
const useProjects = () => useQuery({ queryKey: ["projects"], queryFn: getProjects });
const useProject = (id) => useQuery({ queryKey: ["projects", id], queryFn: () => getProject(id) });
const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createProject, onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }) });
};
const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => updateProject(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }) });
};
const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteProject, onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }) });
};
const useProjectAllocations = (id, targetType) => useQuery({ queryKey: ["project-allocations", id, targetType], queryFn: () => getProjectAllocations(id, targetType) });
const useMarkProjectUsed = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, targetType }) => markProjectUsed(id, targetType), onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }) });
};
const useSubProject = (id) => useQuery({ queryKey: ["subprojects", id], queryFn: () => getSubProject(id) });
const useCreateSubProject = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createSubProject, onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["subprojects"] });
  } });
};
const useUpdateSubProject = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => updateSubProject(id, data), onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["subprojects"] });
  } });
};
const useDeleteSubProject = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteSubProject, onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["subprojects"] });
  } });
};
const useSubProjectAllocations = (id) => useQuery({ queryKey: ["subproject-allocations", id], queryFn: () => getSubProjectAllocations(id) });
const useMarkSubProjectUsed = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id) => markSubProjectUsed(id), onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["subprojects"] });
  } });
};
const useChildProject = (id) => useQuery({ queryKey: ["childprojects", id], queryFn: () => getChildProject(id) });
const useCreateChildProject = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createChildProject, onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["subprojects"] });
    qc.invalidateQueries({ queryKey: ["childprojects"] });
  } });
};
const useUpdateChildProject = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => updateChildProject(id, data), onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["childprojects"] });
  } });
};
const useDeleteChildProject = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteChildProject, onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["childprojects"] });
  } });
};
const useChildProjectAllocations = (id) => useQuery({ queryKey: ["childproject-allocations", id], queryFn: () => getChildProjectAllocations(id) });
const useMarkChildProjectUsed = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id) => markChildProjectUsed(id), onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["childprojects"] });
  } });
};
const useLedger = (page, pageSize) => useQuery({ queryKey: ["ledger", page, pageSize], queryFn: () => getLedger(page, pageSize) });
const useLedgerEntry = (id) => useQuery({ queryKey: ["ledger", id], queryFn: () => getLedgerEntry(id) });
const useCreateLedgerEntry = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createLedgerEntry, onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["ledger"] });
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["attendance"] });
    qc.invalidateQueries({ queryKey: ["salary"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  } });
};
const useUpdateLedgerEntry = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => updateLedgerEntry(id, data), onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["ledger"] });
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["attendance"] });
    qc.invalidateQueries({ queryKey: ["salary"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  } });
};
const useDeleteLedgerEntry = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteLedgerEntry, onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["ledger"] });
    qc.invalidateQueries({ queryKey: ["projects"] });
    qc.invalidateQueries({ queryKey: ["attendance"] });
    qc.invalidateQueries({ queryKey: ["salary"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  } });
};
const useLastLedgerEntry = () => useQuery({ queryKey: ["ledger", "last"], queryFn: getLastLedgerEntry });
const useWorkers = () => useQuery({ queryKey: ["workers"], queryFn: getWorkers });
export {
  useChildProject as A,
  useChildProjectAllocations as B,
  useUpdateChildProject as C,
  useMarkChildProjectUsed as D,
  useLedger as E,
  useDeleteLedgerEntry as F,
  useLastLedgerEntry as G,
  useLedgerEntry as H,
  useWorkers as I,
  useCreateLedgerEntry as J,
  useUpdateLedgerEntry as K,
  useClients as a,
  useCreateClient as b,
  useUpdateClient as c,
  useDeleteClient as d,
  useInventory as e,
  useCreateInventoryItem as f,
  useUpdateInventoryItem as g,
  useDeleteInventoryItem as h,
  useEligibleAllocationTargets as i,
  useAllocateInventory as j,
  useProjects as k,
  useCreateProject as l,
  useUpdateProject as m,
  useDeleteProject as n,
  useCreateSubProject as o,
  useCreateChildProject as p,
  useProject as q,
  useProjectAllocations as r,
  useMarkProjectUsed as s,
  useDeleteSubProject as t,
  useDashboardStats as u,
  useSubProject as v,
  useSubProjectAllocations as w,
  useUpdateSubProject as x,
  useMarkSubProjectUsed as y,
  useDeleteChildProject as z
};
