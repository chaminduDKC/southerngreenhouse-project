import { c as createLucideIcon, u as useNavigate, r as reactExports, j as jsxRuntimeExports, z as zt } from "./index-BvumJaAs.js";
import { P as ProjectStatus } from "./index-v-MSDYfl.js";
import { P as PageHeader } from "./PageHeader-F5xlwJlO.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-CfVOz41m.js";
import { E as EmptyState } from "./EmptyState-wZU2_9Zt.js";
import { M as Modal } from "./Modal-CLdpVs9h.js";
import { C as ConfirmDialog } from "./ConfirmDialog-DmCsxGyN.js";
import { k as useProjects, a as useClients, l as useCreateProject, m as useUpdateProject, n as useDeleteProject, o as useCreateSubProject, p as useCreateChildProject } from "./index-D6YZuVUF.js";
import { P as Plus } from "./plus-BjNY8XxN.js";
import { P as Pen } from "./pen-BkCsVaRE.js";
import { T as Trash2 } from "./trash-2-BdJQzDNY.js";
import { L as LoaderCircle } from "./loader-circle-BgPef-d6.js";
import "./index-MsCQlR0B.js";
import "./useMutation-GA9qKVkW.js";
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronDown = createLucideIcon("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronRight = createLucideIcon("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Folder = createLucideIcon("Folder", [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
]);
const STATUS_FILTERS = ["ALL", ProjectStatus.ACTIVE, ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED, ProjectStatus.ON_HOLD];
const statusBadge = (status) => {
  switch (status) {
    case ProjectStatus.ACTIVE:
      return "badge badge-active";
    case ProjectStatus.IN_PROGRESS:
      return "badge badge-in-progress";
    case ProjectStatus.COMPLETED:
      return "badge badge-completed";
    case ProjectStatus.ON_HOLD:
      return "badge badge-on-hold";
    default:
      return "badge";
  }
};
const fmt = (val) => val?.toLocaleString?.("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "0.00";
function ProjectsPage() {
  const navigate = useNavigate();
  const { data: projects, isLoading } = useProjects();
  const { data: clients } = useClients();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const createSubProject = useCreateSubProject();
  const createChildProject = useCreateChildProject();
  const [statusFilter, setStatusFilter] = reactExports.useState("ALL");
  const [expandedProjects, setExpandedProjects] = reactExports.useState({});
  const [expandedSubs, setExpandedSubs] = reactExports.useState({});
  const [projectModal, setProjectModal] = reactExports.useState(false);
  const [subModal, setSubModal] = reactExports.useState(false);
  const [childModal, setChildModal] = reactExports.useState(false);
  const [selectedParent, setSelectedParent] = reactExports.useState("");
  const [selectedSubId, setSelectedSubId] = reactExports.useState("");
  const [editData, setEditData] = reactExports.useState(null);
  const [confirmOpen, setConfirmOpen] = reactExports.useState(false);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const blank = { clientId: "", title: "", location: "", notes: "", value: 0 };
  const [form, setForm] = reactExports.useState(blank);
  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
  const toggleProject = (id) => setExpandedProjects((p) => ({ ...p, [id]: !p[id] }));
  const toggleSub = (id) => setExpandedSubs((p) => ({ ...p, [id]: !p[id] }));
  const [divisionConfirmOpen, setDivisionConfirmOpen] = reactExports.useState(false);
  const [pendingUpdate, setPendingUpdate] = reactExports.useState(null);
  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        if (editData.subProjects && editData.subProjects.length > 0 && Number(form.value) !== Number(editData.value)) {
          setPendingUpdate({ id: editData.id, data: form });
          setDivisionConfirmOpen(true);
          return;
        }
        await updateProject.mutateAsync({ id: editData.id, data: form });
        zt.success("Project updated");
      } else {
        await createProject.mutateAsync(form);
        zt.success("Project created");
      }
      setProjectModal(false);
      setEditData(null);
      setForm(blank);
    } catch (err) {
      zt.error(err.response?.data?.error || err.message || "Error");
    }
  };
  const handleDivisionConfirm = async (method) => {
    try {
      await updateProject.mutateAsync({ id: pendingUpdate.id, data: { ...pendingUpdate.data, divisionMethod: method } });
      zt.success("Project updated with division");
      setDivisionConfirmOpen(false);
      setPendingUpdate(null);
      setProjectModal(false);
      setEditData(null);
      setForm(blank);
    } catch (err) {
      zt.error(err.response?.data?.error || err.message || "Error");
    }
  };
  const handleSaveSub = async (e) => {
    e.preventDefault();
    try {
      await createSubProject.mutateAsync({ projectId: selectedParent, ...form });
      zt.success("Sub-project created");
      setExpandedProjects((p) => ({ ...p, [selectedParent]: true }));
      setSubModal(false);
      setForm(blank);
    } catch (err) {
      zt.error(err.response?.data?.error || err.message || "Error");
    }
  };
  const handleSaveChild = async (e) => {
    e.preventDefault();
    try {
      await createChildProject.mutateAsync({ subProjectId: selectedSubId, ...form });
      zt.success("Child project created");
      setExpandedSubs((p) => ({ ...p, [selectedSubId]: true }));
      setChildModal(false);
      setForm(blank);
    } catch (err) {
      zt.error(err.response?.data?.error || err.message || "Error");
    }
  };
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteProject.mutateAsync(deletingId);
      zt.success("Project deleted");
      setConfirmOpen(false);
    } catch (err) {
      zt.error(err.message || "Failed");
    }
  };
  const filtered = projects?.filter((p) => statusFilter === "ALL" || p.status === statusFilter) || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Projects",
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-primary", onClick: () => {
          setEditData(null);
          setForm(blank);
          setProjectModal(true);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
          " New Project"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }, children: STATUS_FILTERS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setStatusFilter(s),
        style: {
          padding: "0.4rem 1rem",
          borderRadius: "9999px",
          fontSize: "0.8rem",
          fontWeight: 600,
          border: "1px solid",
          cursor: "pointer",
          transition: "all 0.2s",
          borderColor: statusFilter === s ? "var(--primary)" : "var(--border)",
          background: statusFilter === s ? "var(--primary-glow)" : "var(--surface-2)",
          color: statusFilter === s ? "var(--primary)" : "var(--text-secondary)"
        },
        children: String(s).replace("_", " ")
      },
      s
    )) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 4 }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, {}), title: "No projects found", message: "Create one to get started." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: filtered.map((project) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", style: { padding: 0, overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0.9rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn btn-ghost btn-sm",
              style: { padding: "0.3rem", flexShrink: 0 },
              onClick: () => toggleProject(project.id),
              title: expandedProjects[project.id] ? "Collapse" : "Expand sub-projects",
              children: expandedProjects[project.id] ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: { flex: 1, minWidth: 0, cursor: "pointer" },
              onClick: () => navigate(`/projects/${project.id}`),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { size: 16, color: "var(--accent)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600, color: "var(--text-primary)", fontSize: "1rem" }, children: project.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: statusBadge(project.status), children: project.status.replace("_", " ") })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem", display: "flex", gap: "1rem" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: project.client?.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: project.location }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--text-muted)" }, children: [
                    project.subProjects?.length || 0,
                    " sub-projects"
                  ] })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right", fontSize: "0.85rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: 600, color: "var(--success)" }, children: [
              "LKR ",
              fmt(project.value)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "var(--danger)", fontSize: "0.75rem" }, children: [
              "Cost: LKR ",
              fmt(project.cost)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "0.4rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "btn btn-secondary btn-sm",
                onClick: () => {
                  setSelectedParent(project.id);
                  setForm(blank);
                  setSubModal(true);
                },
                title: "Add sub-project",
                children: "+ Sub"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost btn-sm", title: "Edit", onClick: () => {
              setEditData(project);
              setForm({ clientId: project.clientId, title: project.title, location: project.location, notes: project.notes, value: project.value });
              setProjectModal(true);
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 14 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost btn-sm", style: { color: "var(--danger)" }, title: "Delete", onClick: () => {
              setDeletingId(project.id);
              setConfirmOpen(true);
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }) })
          ] })
        ] })
      ] }),
      expandedProjects[project.id] && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { background: "rgba(0,0,0,0.12)", borderTop: "1px solid var(--border)", padding: "0.75rem 1.25rem 0.75rem 3rem" }, children: !project.subProjects || project.subProjects.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0.75rem", color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center" }, children: [
        "No sub-projects yet.  ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary btn-sm", onClick: () => {
          setSelectedParent(project.id);
          setForm(blank);
          setSubModal(true);
        }, children: "+ Add Sub-project" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem", borderLeft: "2px solid var(--accent)", paddingLeft: "1rem" }, children: project.subProjects.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          padding: "0.6rem 0.9rem",
          borderRadius: "var(--radius-sm)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.6rem", flex: 1, minWidth: 0, cursor: "pointer" }, onClick: () => navigate(`/subprojects/${sub.id}`), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "btn btn-ghost btn-sm",
                style: { padding: "0.2rem", flexShrink: 0 },
                onClick: (e) => {
                  e.stopPropagation();
                  toggleSub(sub.id);
                },
                title: expandedSubs[sub.id] ? "Collapse children" : "Expand children",
                children: expandedSubs[sub.id] ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: statusBadge(sub.status), style: { fontSize: "0.65rem" }, children: sub.status.replace("_", " ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 500, color: "var(--text-primary)", fontSize: "0.9rem" }, children: sub.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.78rem", color: "var(--text-secondary)" }, children: sub.location })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "0.75rem", color: "var(--text-muted)" }, children: [
              sub.children?.length || 0,
              " child",
              (sub.children?.length || 0) !== 1 ? "ren" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--success)" }, children: [
              "LKR ",
              fmt(sub.value)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--danger)" }, children: [
              "Cost: LKR ",
              fmt(sub.cost)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "btn btn-secondary btn-sm",
                style: { fontSize: "0.75rem", padding: "0.25rem 0.6rem" },
                onClick: (e) => {
                  e.stopPropagation();
                  setSelectedSubId(sub.id);
                  setForm(blank);
                  setChildModal(true);
                },
                title: "Add child project",
                children: "+ Child"
              }
            )
          ] })
        ] }),
        expandedSubs[sub.id] && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          marginLeft: "1.5rem",
          marginTop: "0.4rem",
          borderLeft: "2px solid var(--primary)",
          paddingLeft: "1rem"
        }, children: !sub.children || sub.children.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0.5rem", color: "var(--text-muted)", fontSize: "0.8rem" }, children: [
          "No child projects.  ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn btn-secondary btn-sm",
              style: { fontSize: "0.75rem" },
              onClick: () => {
                setSelectedSubId(sub.id);
                setForm(blank);
                setChildModal(true);
              },
              children: "+ Add Child"
            }
          )
        ] }) : sub.children.map((child) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(0,0,0,0.15)",
              border: "1px solid var(--border)",
              padding: "0.5rem 0.8rem",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer"
            },
            onClick: () => navigate(`/childprojects/${child.id}`),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.6rem" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: statusBadge(child.status), style: { fontSize: "0.6rem" }, children: child.status.replace("_", " ") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 500, fontSize: "0.85rem", color: "var(--text-primary)" }, children: child.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.75rem", color: "var(--text-secondary)" }, children: child.location })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "1rem", fontSize: "0.75rem" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--success)" }, children: [
                  "LKR ",
                  fmt(child.value)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--danger)" }, children: [
                  "Cost: LKR ",
                  fmt(child.cost)
                ] })
              ] })
            ]
          },
          child.id
        )) })
      ] }, sub.id)) }) })
    ] }, project.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: projectModal,
        onClose: () => {
          setProjectModal(false);
          setEditData(null);
        },
        title: editData ? "Edit Project" : "New Project",
        size: "md",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost", onClick: () => {
            setProjectModal(false);
            setEditData(null);
          }, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", form: "project-form", type: "submit", disabled: createProject.isPending || updateProject.isPending, children: createProject.isPending || updateProject.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin mr-2 inline" }),
            " Saving…"
          ] }) : "Save" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "project-form", onSubmit: handleSaveProject, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Client" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { autoFocus: true, className: "form-select", value: form.clientId, onChange: (e) => set("clientId", e.target.value), required: !editData, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select client…" }),
              clients?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "form-input", value: form.title, onChange: (e) => set("title", e.target.value), required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Location" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "form-input", value: form.location, onChange: (e) => set("location", e.target.value), required: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Value (LKR)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", step: "0.01", className: "form-input", value: form.value, onChange: (e) => set("value", parseFloat(e.target.value) || 0), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "form-textarea", value: form.notes, onChange: (e) => set("notes", e.target.value), rows: 2 })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: subModal,
        onClose: () => setSubModal(false),
        title: "New Sub-project",
        size: "md",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost", onClick: () => setSubModal(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", form: "sub-form", type: "submit", disabled: createSubProject.isPending, children: createSubProject.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin mr-2 inline" }),
            " Saving…"
          ] }) : "Save" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "sub-form", onSubmit: handleSaveSub, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { autoFocus: true, className: "form-input", value: form.title, onChange: (e) => set("title", e.target.value), required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Location" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "form-input", value: form.location, onChange: (e) => set("location", e.target.value), required: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Value (LKR)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", step: "0.01", className: "form-input", value: form.value, onChange: (e) => set("value", parseFloat(e.target.value) || 0), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "form-textarea", value: form.notes, onChange: (e) => set("notes", e.target.value), rows: 2 })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: childModal,
        onClose: () => setChildModal(false),
        title: "New Child Project",
        size: "md",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost", onClick: () => setChildModal(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", form: "child-form", type: "submit", disabled: createChildProject.isPending, children: createChildProject.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin mr-2 inline" }),
            " Saving…"
          ] }) : "Save" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "child-form", onSubmit: handleSaveChild, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { autoFocus: true, className: "form-input", value: form.title, onChange: (e) => set("title", e.target.value), required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Location" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "form-input", value: form.location, onChange: (e) => set("location", e.target.value), required: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Value (LKR)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", step: "0.01", className: "form-input", value: form.value, onChange: (e) => set("value", parseFloat(e.target.value) || 0), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "form-textarea", value: form.notes, onChange: (e) => set("notes", e.target.value), rows: 2 })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        isOpen: confirmOpen,
        onClose: () => setConfirmOpen(false),
        onConfirm: handleDelete,
        title: "Delete Project",
        message: "Are you sure you want to delete this project? This will permanently delete all sub-projects, child projects, quotations, invoices, and ledger records.",
        isPending: deleteProject.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Modal,
      {
        isOpen: divisionConfirmOpen,
        onClose: () => setDivisionConfirmOpen(false),
        title: "Divide Project Value",
        size: "md",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost", onClick: () => setDivisionConfirmOpen(false), children: "Cancel" }),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.5 }, children: "You have changed the main project's value. How would you like this new value to be distributed among its existing sub-projects and child projects?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "btn btn-primary",
                style: { padding: "1rem", height: "auto", justifyContent: "flex-start", textAlign: "left" },
                onClick: () => handleDivisionConfirm("EQUAL"),
                disabled: updateProject.isPending,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600, fontSize: "1rem", marginBottom: "0.25rem" }, children: "Divide Equally" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 400, fontSize: "0.8rem", opacity: 0.8 }, children: "The new value will be split evenly across all sub-projects." })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "btn btn-secondary",
                style: { padding: "1rem", height: "auto", justifyContent: "flex-start", textAlign: "left" },
                onClick: () => handleDivisionConfirm("PROPORTIONAL"),
                disabled: updateProject.isPending,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 600, fontSize: "1rem", marginBottom: "0.25rem" }, children: "Divide Proportionally" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 400, fontSize: "0.8rem", opacity: 0.8 }, children: "The new value will be distributed based on the current ratio of each sub-project's value." })
                ] })
              }
            )
          ] })
        ]
      }
    )
  ] });
}
export {
  ProjectsPage as default
};
