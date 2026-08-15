import { u as useNavigate, d as useQueryClient, r as reactExports, j as jsxRuntimeExports, H as HardHat, z as zt } from "./index-BvumJaAs.js";
import { u as useQuery, X as updateWorker, Y as createWorker, Z as deleteWorker, M as getWorkers } from "./index-MsCQlR0B.js";
import { u as useMutation } from "./useMutation-GA9qKVkW.js";
import { R as RateType } from "./index-v-MSDYfl.js";
import { P as PageHeader } from "./PageHeader-F5xlwJlO.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-CfVOz41m.js";
import { E as EmptyState } from "./EmptyState-wZU2_9Zt.js";
import { M as Modal } from "./Modal-CLdpVs9h.js";
import { C as ConfirmDialog } from "./ConfirmDialog-DmCsxGyN.js";
import { P as Plus } from "./plus-BjNY8XxN.js";
import { P as Pen } from "./pen-BkCsVaRE.js";
import { T as Trash2 } from "./trash-2-BdJQzDNY.js";
import "./loader-circle-BgPef-d6.js";
function WorkersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const [editingWorker, setEditingWorker] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({
    name: "",
    phone: "",
    address: "",
    rateType: "DAILY",
    rate: 0
  });
  const [isConfirmOpen, setIsConfirmOpen] = reactExports.useState(false);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const { data: workers, isLoading } = useQuery({
    queryKey: ["workers"],
    queryFn: getWorkers
  });
  const mutation = useMutation({
    mutationFn: (data) => editingWorker ? updateWorker(editingWorker.id, data) : createWorker(data),
    onSuccess: () => {
      zt.success(`Worker ${editingWorker ? "updated" : "created"}`);
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      closeModal();
    },
    onError: () => zt.error("An error occurred")
  });
  const deleteMutation = useMutation({
    mutationFn: deleteWorker,
    onSuccess: () => {
      zt.success("Worker deleted");
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      setIsConfirmOpen(false);
    },
    onError: () => zt.error("Failed to delete worker")
  });
  const openModal = (worker) => {
    if (worker) {
      setEditingWorker(worker);
      setFormData({
        name: worker.name,
        phone: worker.phone,
        address: worker.address,
        rateType: worker.rateType,
        rate: worker.rate
      });
    } else {
      setEditingWorker(null);
      setFormData({ name: "", phone: "", address: "", rateType: RateType.DAILY, rate: 0 });
    }
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWorker(null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };
  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Workers",
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-primary", onClick: () => openModal(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
          " Add Worker"
        ] })
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 5 }) : !workers || workers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(HardHat, {}),
        title: "No workers found",
        message: "Get started by adding your first worker."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Worker ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Rate Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Rate (LKR)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: workers.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { cursor: "pointer" }, onClick: () => navigate(`/workers/${w.id}`), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-worker-id", children: w.workerId }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: w.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: w.phone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${w.rateType === "DAILY" ? "badge-in-progress" : "badge-active"}`, children: w.rateType }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: w.rate?.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "0.5rem", justifyContent: "flex-end" }, onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openModal(w), className: "btn btn-ghost btn-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                setDeletingId(w.id);
                setIsConfirmOpen(true);
              },
              className: "btn btn-ghost btn-sm",
              style: { color: "var(--danger)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
            }
          )
        ] }) })
      ] }, w.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: closeModal,
        title: editingWorker ? "Edit Worker" : "Add Worker",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn-ghost", onClick: closeModal, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", form: "worker-form", className: "btn btn-primary", disabled: mutation.isPending, children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { size: 16, className: "animate-spin mr-2 inline" }),
            " Saving..."
          ] }) : "Save" })
        ] }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "worker-form", onSubmit: handleSubmit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, className: "form-input", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, className: "form-input", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, className: "form-textarea", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Rate Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "form-select", value: formData.rateType, onChange: (e) => setFormData({ ...formData, rateType: e.target.value }), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "DAILY", children: "Daily" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "MONTHLY", children: "Monthly" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Rate (LKR)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", required: true, className: "form-input", value: formData.rate, onChange: (e) => setFormData({ ...formData, rate: Number(e.target.value) }) })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        isOpen: isConfirmOpen,
        onClose: () => setIsConfirmOpen(false),
        onConfirm: handleDelete,
        title: "Delete Worker",
        message: "Are you sure you want to delete this worker? This action cannot be undone.",
        isPending: deleteMutation.isPending
      }
    )
  ] });
}
export {
  WorkersPage as default
};
