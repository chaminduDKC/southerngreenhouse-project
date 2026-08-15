import { b as useParams, u as useNavigate, r as reactExports, j as jsxRuntimeExports, z as zt } from "./index-BvumJaAs.js";
import { P as ProjectStatus } from "./index-v-MSDYfl.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-CfVOz41m.js";
import { E as EmptyState } from "./EmptyState-wZU2_9Zt.js";
import { M as Modal } from "./Modal-CLdpVs9h.js";
import { C as ConfirmDialog } from "./ConfirmDialog-DmCsxGyN.js";
import { q as useProject, r as useProjectAllocations, m as useUpdateProject, s as useMarkProjectUsed, o as useCreateSubProject, t as useDeleteSubProject } from "./index-D6YZuVUF.js";
import { P as PackageOpen } from "./package-open-fyku7u3G.js";
import { A as ArrowLeft } from "./arrow-left-Z22Cy2p_.js";
import { C as CircleCheckBig } from "./circle-check-big-B3S83hcW.js";
import { P as Pen } from "./pen-BkCsVaRE.js";
import { P as Plus } from "./plus-BjNY8XxN.js";
import { T as Trash2 } from "./trash-2-BdJQzDNY.js";
import { L as LoaderCircle } from "./loader-circle-BgPef-d6.js";
import "./index-MsCQlR0B.js";
import "./useMutation-GA9qKVkW.js";
function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(id);
  const { data: allocations, isLoading: allocLoading } = useProjectAllocations(id, "projects");
  const updateProject = useUpdateProject();
  const markUsed = useMarkProjectUsed();
  const createSubProject = useCreateSubProject();
  const deleteSubProject = useDeleteSubProject();
  const [isEditModalOpen, setIsEditModalOpen] = reactExports.useState(false);
  const [isAllocModalOpen, setIsAllocModalOpen] = reactExports.useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = reactExports.useState(false);
  const [isMarkUsedConfirmOpen, setIsMarkUsedConfirmOpen] = reactExports.useState(false);
  const [deletingSubId, setDeletingSubId] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({});
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 6 }) });
  }
  if (!project) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PackageOpen, {}), title: "Project not found", message: "This project may have been deleted or the link is incorrect." }) });
  }
  const formatCurrency = (val) => (val || 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return "badge-active";
      case ProjectStatus.IN_PROGRESS:
        return "badge-in-progress";
      case ProjectStatus.COMPLETED:
        return "badge-completed";
      case ProjectStatus.ON_HOLD:
        return "badge-on-hold";
      default:
        return "badge";
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProject.mutateAsync({ id, data: formData });
      zt.success("Project updated");
      setIsEditModalOpen(false);
    } catch (err) {
      zt.error(err.message || "Error updating project");
    }
  };
  const handleCreateSub = async (e) => {
    e.preventDefault();
    try {
      await createSubProject.mutateAsync({ ...formData, projectId: id });
      zt.success("Sub-project created");
      setIsSubModalOpen(false);
    } catch (err) {
      zt.error(err.message || "Error creating sub-project");
    }
  };
  const handleMarkUsed = async () => {
    try {
      await markUsed.mutateAsync({ id, targetType: "projects" });
      zt.success("Marked as used");
      setIsMarkUsedConfirmOpen(false);
    } catch (err) {
      zt.error(err.message || "Error");
    }
  };
  const handleDeleteSub = async () => {
    if (!deletingSubId) return;
    try {
      await deleteSubProject.mutateAsync(deletingSubId);
      zt.success("Deleted sub-project");
      setDeletingSubId(null);
    } catch (err) {
      zt.error(err.message || "Error");
    }
  };
  const margin = (project.value || 0) - (project.cost || 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-ghost btn-sm", onClick: () => navigate("/projects"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
        " Back"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: project.title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", style: { marginBottom: "2rem", position: "relative", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 0, right: 0, padding: "1.5rem", opacity: 0.06, pointerEvents: "none", color: "var(--primary)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PackageOpen, { size: 120 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", position: "relative", zIndex: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }, children: project.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "0.75rem", alignItems: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${getStatusBadgeClass(project.status)}`, children: project.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Client: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: project.client?.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Location: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: project.location })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "0.5rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-secondary", onClick: () => setIsAllocModalOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PackageOpen, { size: 16 }),
            " View Allocations"
          ] }),
          project.status !== ProjectStatus.COMPLETED && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-secondary", style: { color: "var(--accent)", borderColor: "rgba(99,102,241,0.3)" }, onClick: () => setIsMarkUsedConfirmOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 16 }),
            " Mark All Used"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn btn-secondary",
              onClick: () => {
                setFormData({ title: project.title, location: project.location, value: project.value, notes: project.notes, status: project.status });
                setIsEditModalOpen(true);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 16 }),
                " Edit"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1rem", position: "relative", zIndex: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card glass-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }, children: "Total Value" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.3rem", fontWeight: 600, color: "var(--success)" }, children: [
            "LKR ",
            formatCurrency(project.value)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card stat-danger glass-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }, children: "Total Cost" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.3rem", fontWeight: 600, color: "var(--danger)" }, children: [
            "LKR ",
            formatCurrency(project.cost)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card stat-accent glass-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }, children: "Profit / Margin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.3rem", fontWeight: 600, color: "var(--accent)" }, children: [
            "LKR ",
            formatCurrency(margin)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card glass-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }, children: "Sub-projects" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)" }, children: project.subProjects?.length || 0 })
        ] })
      ] }),
      project.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.15)", border: "1px solid var(--border)", padding: "1rem", borderRadius: "var(--radius-sm)", fontSize: "0.9rem", color: "var(--text-secondary)", position: "relative", zIndex: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { display: "block", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }, children: "Notes:" }),
        project.notes
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.3rem", fontWeight: 700, color: "#fff" }, children: "Sub-projects" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "btn btn-primary btn-sm",
          onClick: () => {
            setFormData({ title: "", location: "", value: 0, notes: "" });
            setIsSubModalOpen(true);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
            " Add Sub-project"
          ]
        }
      )
    ] }),
    (project.subProjects?.length || 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PackageOpen, {}), title: "No sub-projects found", message: "Add a sub-project to start breaking this project down." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Location" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Children" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: project.subProjects.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { cursor: "pointer" }, onClick: () => navigate(`/subprojects/${sub.id}`), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: sub.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: sub.location }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${getStatusBadgeClass(sub.status)}`, children: sub.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: sub.children?.length || 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "0.5rem" }, onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost btn-sm", style: { color: "var(--accent)" }, onClick: () => navigate(`/subprojects/${sub.id}`), children: "View" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost btn-sm", style: { color: "var(--danger)" }, onClick: () => setDeletingSubId(sub.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }) })
        ] }) })
      ] }, sub.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: isEditModalOpen,
        onClose: () => setIsEditModalOpen(false),
        title: "Edit Project",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn-ghost", onClick: () => setIsEditModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "edit-project-form", className: "btn btn-primary", disabled: updateProject.isPending, children: updateProject.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin mr-2 inline" }),
            " Saving..."
          ] }) : "Save Changes" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "edit-project-form", onSubmit: handleUpdate, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: "form-input", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "form-select", value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ProjectStatus.ACTIVE, children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ProjectStatus.IN_PROGRESS, children: "In Progress" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ProjectStatus.COMPLETED, children: "Completed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ProjectStatus.ON_HOLD, children: "On Hold" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Location" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: "form-input", value: formData.location, onChange: (e) => setFormData({ ...formData, location: e.target.value }), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Value (LKR)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", step: "0.01", className: "form-input", value: formData.value, onChange: (e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 }), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "form-textarea", value: formData.notes, onChange: (e) => setFormData({ ...formData, notes: e.target.value }), rows: 3 })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: isSubModalOpen,
        onClose: () => setIsSubModalOpen(false),
        title: "New Sub-project",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn-ghost", onClick: () => setIsSubModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "new-subproject-form", className: "btn btn-primary", disabled: createSubProject.isPending, children: createSubProject.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin mr-2 inline" }),
            " Saving..."
          ] }) : "Save" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "new-subproject-form", onSubmit: handleCreateSub, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: "form-input", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Location" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: "form-input", value: formData.location, onChange: (e) => setFormData({ ...formData, location: e.target.value }), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Value (LKR)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", step: "0.01", className: "form-input", value: formData.value, onChange: (e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 }), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "form-textarea", value: formData.notes, onChange: (e) => setFormData({ ...formData, notes: e.target.value }), rows: 3 })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: isAllocModalOpen,
        onClose: () => setIsAllocModalOpen(false),
        title: "Project Allocations",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost", onClick: () => setIsAllocModalOpen(false), children: "Close" }),
        children: allocLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 4 }) : (allocations?.length || 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PackageOpen, {}), title: "No allocations found", message: "No inventory has been allocated to this project yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", style: { maxHeight: "60vh", overflow: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Item" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Quantity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Date" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: allocations.map((alloc) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: alloc.inventoryItem?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
              alloc.quantity,
              " ",
              alloc.inventoryItem?.unit
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${alloc.status === "USED" ? "badge-completed" : "badge-active"}`, children: alloc.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: new Date(alloc.createdAt).toLocaleDateString() })
          ] }, alloc.id)) })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        isOpen: isMarkUsedConfirmOpen,
        onClose: () => setIsMarkUsedConfirmOpen(false),
        onConfirm: handleMarkUsed,
        title: "Mark All Items Used",
        message: "This will mark all allocated items as used and set the project to COMPLETED. This action cannot be undone.",
        isPending: markUsed.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        isOpen: !!deletingSubId,
        onClose: () => setDeletingSubId(null),
        onConfirm: handleDeleteSub,
        title: "Delete Sub-project",
        message: "Are you sure you want to delete this sub-project? This action cannot be undone.",
        isPending: deleteSubProject.isPending
      }
    )
  ] });
}
export {
  ProjectDetailPage as default
};
