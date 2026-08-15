import { b as useParams, u as useNavigate, r as reactExports, j as jsxRuntimeExports, z as zt } from "./index-BvumJaAs.js";
import { P as ProjectStatus } from "./index-v-MSDYfl.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-CfVOz41m.js";
import { E as EmptyState } from "./EmptyState-wZU2_9Zt.js";
import { M as Modal } from "./Modal-CLdpVs9h.js";
import { C as ConfirmDialog } from "./ConfirmDialog-DmCsxGyN.js";
import { v as useSubProject, w as useSubProjectAllocations, q as useProject, x as useUpdateSubProject, y as useMarkSubProjectUsed, p as useCreateChildProject, z as useDeleteChildProject } from "./index-D6YZuVUF.js";
import { P as PackageOpen } from "./package-open-fyku7u3G.js";
import { A as ArrowLeft } from "./arrow-left-Z22Cy2p_.js";
import { C as CircleCheckBig } from "./circle-check-big-B3S83hcW.js";
import { P as Pen } from "./pen-BkCsVaRE.js";
import { P as Plus } from "./plus-BjNY8XxN.js";
import { T as Trash2 } from "./trash-2-BdJQzDNY.js";
import { L as LoaderCircle } from "./loader-circle-BgPef-d6.js";
import "./index-MsCQlR0B.js";
import "./useMutation-GA9qKVkW.js";
function SubProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: subProject, isLoading } = useSubProject(id);
  const { data: allocations, isLoading: allocLoading } = useSubProjectAllocations(id);
  const { data: parentProject } = useProject(subProject?.projectId || "");
  const updateSubProject = useUpdateSubProject();
  const markUsed = useMarkSubProjectUsed();
  const createChildProject = useCreateChildProject();
  const deleteChildProject = useDeleteChildProject();
  const [isEditModalOpen, setIsEditModalOpen] = reactExports.useState(false);
  const [isAllocModalOpen, setIsAllocModalOpen] = reactExports.useState(false);
  const [isChildModalOpen, setIsChildModalOpen] = reactExports.useState(false);
  const [isMarkUsedConfirmOpen, setIsMarkUsedConfirmOpen] = reactExports.useState(false);
  const [deletingChildId, setDeletingChildId] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({});
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 6 }) });
  }
  if (!subProject) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PackageOpen, {}), title: "Sub-project not found", message: "This sub-project may have been deleted or the link is incorrect." }) });
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
      await updateSubProject.mutateAsync({ id, data: formData });
      zt.success("Sub-project updated");
      setIsEditModalOpen(false);
    } catch (err) {
      zt.error(err.message || "Error updating");
    }
  };
  const handleCreateChild = async (e) => {
    e.preventDefault();
    try {
      await createChildProject.mutateAsync({ ...formData, subProjectId: id });
      zt.success("Child project created");
      setIsChildModalOpen(false);
    } catch (err) {
      zt.error(err.message || "Error creating child project");
    }
  };
  const handleMarkUsed = async () => {
    try {
      await markUsed.mutateAsync(id);
      zt.success("Marked as used");
      setIsMarkUsedConfirmOpen(false);
    } catch (err) {
      zt.error(err.message || "Error");
    }
  };
  const handleDeleteChild = async () => {
    if (!deletingChildId) return;
    try {
      await deleteChildProject.mutateAsync(deletingChildId);
      zt.success("Deleted child project");
      setDeletingChildId(null);
    } catch (err) {
      zt.error(err.message || "Error");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", fontSize: "0.9rem", color: "var(--text-secondary)", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-ghost btn-sm", onClick: () => navigate(`/projects/${subProject.projectId}`), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
        " Back"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { cursor: "pointer" }, onClick: () => navigate(`/projects/${subProject.projectId}`), children: parentProject?.title || "Project" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: subProject.title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", style: { marginBottom: "2rem", position: "relative", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", fontWeight: 600, color: "var(--accent)", letterSpacing: "0.05em", marginBottom: "0.35rem" }, children: "SUB-PROJECT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }, children: subProject.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "0.75rem", alignItems: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${getStatusBadgeClass(subProject.status)}`, children: subProject.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Location: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: subProject.location })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "0.5rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-secondary", onClick: () => setIsAllocModalOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PackageOpen, { size: 16 }),
            " View Allocations"
          ] }),
          subProject.status !== ProjectStatus.COMPLETED && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-secondary", style: { color: "var(--accent)", borderColor: "rgba(99,102,241,0.3)" }, onClick: () => setIsMarkUsedConfirmOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 16 }),
            " Mark All Used"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn btn-secondary",
              onClick: () => {
                setFormData({ title: subProject.title, location: subProject.location, value: subProject.value, notes: subProject.notes, status: subProject.status });
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card glass-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }, children: "Value" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.3rem", fontWeight: 600, color: "var(--success)" }, children: [
            "LKR ",
            formatCurrency(subProject.value)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card stat-danger glass-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }, children: "Cost" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.3rem", fontWeight: 600, color: "var(--danger)" }, children: [
            "LKR ",
            formatCurrency(subProject.cost)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-card stat-accent glass-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }, children: "Children" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)" }, children: subProject.children?.length || 0 })
        ] })
      ] }),
      subProject.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(0,0,0,0.15)", border: "1px solid var(--border)", padding: "1rem", borderRadius: "var(--radius-sm)", fontSize: "0.9rem", color: "var(--text-secondary)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { display: "block", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }, children: "Notes:" }),
        subProject.notes
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.3rem", fontWeight: 700, color: "#fff" }, children: "Child Projects" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "btn btn-primary btn-sm",
          onClick: () => {
            setFormData({ title: "", location: "", value: 0, notes: "" });
            setIsChildModalOpen(true);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
            " Add Child Project"
          ]
        }
      )
    ] }),
    (subProject.children?.length || 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PackageOpen, {}), title: "No child projects found", message: "Add a child project to break this sub-project down further." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Location" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: subProject.children.map((child) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { cursor: "pointer" }, onClick: () => navigate(`/childprojects/${child.id}`), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: child.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: child.location }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${getStatusBadgeClass(child.status)}`, children: child.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "0.5rem" }, onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost btn-sm", style: { color: "var(--accent)" }, onClick: () => navigate(`/childprojects/${child.id}`), children: "View" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost btn-sm", style: { color: "var(--danger)" }, onClick: () => setDeletingChildId(child.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }) })
        ] }) })
      ] }, child.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: isEditModalOpen,
        onClose: () => setIsEditModalOpen(false),
        title: "Edit Sub-project",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn-ghost", onClick: () => setIsEditModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "edit-subproject-form", className: "btn btn-primary", disabled: updateSubProject.isPending, children: updateSubProject.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin mr-2 inline" }),
            " Saving..."
          ] }) : "Save Changes" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "edit-subproject-form", onSubmit: handleUpdate, children: [
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
        isOpen: isChildModalOpen,
        onClose: () => setIsChildModalOpen(false),
        title: "New Child Project",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn-ghost", onClick: () => setIsChildModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "new-child-form", className: "btn btn-primary", disabled: createChildProject.isPending, children: createChildProject.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin mr-2 inline" }),
            " Saving..."
          ] }) : "Save" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "new-child-form", onSubmit: handleCreateChild, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { autoFocus: true, type: "text", className: "form-input", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), required: true })
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
        title: "Allocations",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost", onClick: () => setIsAllocModalOpen(false), children: "Close" }),
        children: allocLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 4 }) : (allocations?.length || 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PackageOpen, {}), title: "No allocations found", message: "No inventory has been allocated to this sub-project yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", style: { maxHeight: "60vh", overflow: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
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
        message: "This will mark all allocated items as used and set this sub-project to COMPLETED. This action cannot be undone.",
        isPending: markUsed.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        isOpen: !!deletingChildId,
        onClose: () => setDeletingChildId(null),
        onConfirm: handleDeleteChild,
        title: "Delete Child Project",
        message: "Are you sure you want to delete this child project? This action cannot be undone.",
        isPending: deleteChildProject.isPending
      }
    )
  ] });
}
export {
  SubProjectDetailPage as default
};
