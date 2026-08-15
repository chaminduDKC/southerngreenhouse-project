import { c as createLucideIcon, j as jsxRuntimeExports, u as useNavigate, r as reactExports, P as Package } from "./index-BvumJaAs.js";
import { P as PageHeader } from "./PageHeader-F5xlwJlO.js";
import { S as SearchInput } from "./SearchInput-Bswnjgid.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-CfVOz41m.js";
import { E as EmptyState } from "./EmptyState-wZU2_9Zt.js";
import { M as Modal } from "./Modal-CLdpVs9h.js";
import { C as ConfirmDialog } from "./ConfirmDialog-DmCsxGyN.js";
import { e as useInventory, f as useCreateInventoryItem, g as useUpdateInventoryItem, h as useDeleteInventoryItem } from "./index-D6YZuVUF.js";
import { P as Plus } from "./plus-BjNY8XxN.js";
import { P as Pen } from "./pen-BkCsVaRE.js";
import { T as Trash2 } from "./trash-2-BdJQzDNY.js";
import "./loader-circle-BgPef-d6.js";
import "./index-MsCQlR0B.js";
import "./useMutation-GA9qKVkW.js";
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowRightLeft = createLucideIcon("ArrowRightLeft", [
  ["path", { d: "m16 3 4 4-4 4", key: "1x1c3m" }],
  ["path", { d: "M20 7H4", key: "zbl0bi" }],
  ["path", { d: "m8 21-4-4 4-4", key: "h9nckh" }],
  ["path", { d: "M4 17h16", key: "g4d7ey" }]
]);
const variantMap = {
  active: "badge-active",
  in_progress: "badge-in-progress",
  completed: "badge-completed",
  on_hold: "badge-on-hold",
  draft: "badge-draft",
  sent: "badge-sent",
  accepted: "badge-accepted",
  rejected: "badge-rejected",
  low_stock: "badge-low-stock",
  allocated: "badge-allocated",
  used: "badge-used",
  worker_id: "badge-worker-id"
};
const Badge = ({ variant, children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${variantMap[variant]}`, children });
};
const InventoryPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const { data: inventory, isLoading } = useInventory(search);
  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const deleteItem = useDeleteInventoryItem();
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const [editingItem, setEditingItem] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({
    name: "",
    unit: "",
    unitSize: 1,
    boughtPrice: 0,
    soldPrice: 0,
    quantity: 0,
    lowStockThreshold: 10
  });
  const [isConfirmOpen, setIsConfirmOpen] = reactExports.useState(false);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const [deleteError, setDeleteError] = reactExports.useState(null);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(amount);
  };
  const handleOpenModal = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        unit: item.unit,
        unitSize: item.unitSize,
        boughtPrice: item.boughtPrice,
        soldPrice: item.soldPrice,
        quantity: item.quantity,
        lowStockThreshold: item.lowStockThreshold
      });
    } else {
      setEditingItem(null);
      setFormData({ name: "", unit: "", unitSize: 1, boughtPrice: 0, soldPrice: 0, quantity: 0, lowStockThreshold: 10 });
    }
    setIsModalOpen(true);
  };
  const handleSave = () => {
    const data = {
      ...formData,
      unitSize: Number(formData.unitSize),
      boughtPrice: Number(formData.boughtPrice),
      soldPrice: Number(formData.soldPrice),
      quantity: Number(formData.quantity),
      lowStockThreshold: Number(formData.lowStockThreshold)
    };
    if (editingItem) {
      updateItem.mutate({ id: editingItem.id, data }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createItem.mutate(data, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };
  const handleDelete = () => {
    if (deletingId) {
      setDeleteError(null);
      deleteItem.mutate(deletingId, {
        onSuccess: () => {
          setIsConfirmOpen(false);
        },
        onError: (err) => {
          setDeleteError(err.response?.data?.message || "Failed to delete item. It might be allocated to a project.");
          setIsConfirmOpen(false);
        }
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Inventory",
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "1rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-secondary", onClick: () => navigate("/inventory/allocate"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { size: 18 }),
            " Allocate"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-primary", onClick: () => handleOpenModal(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
            " Add Item"
          ] })
        ] })
      }
    ),
    deleteError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "alert alert-danger", style: { marginBottom: "1.5rem" }, children: deleteError }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "1.5rem" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchInput, { value: search, onChange: setSearch, placeholder: "Search inventory items..." }) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 5 }) : !inventory || inventory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, {}),
        title: "No inventory found",
        message: search ? "Try adjusting your search query." : "Get started by adding your first inventory item."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Unit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Unit Size" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Qty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Bought Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Sold Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: inventory.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { cursor: "pointer" }, onClick: () => navigate(`/inventory/${item.id}`), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: item.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.unit }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.unitSize }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontWeight: 600 }, children: item.quantity }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: formatCurrency(item.boughtPrice) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: formatCurrency(item.soldPrice) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.isLowStock || item.quantity <= item.lowStockThreshold ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "low_stock", children: "Low Stock" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "active", children: "In Stock" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "0.5rem", justifyContent: "flex-end" }, onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost btn-sm", onClick: () => handleOpenModal(item), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost btn-sm", style: { color: "var(--danger)" }, onClick: () => {
            setDeletingId(item.id);
            setIsConfirmOpen(true);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }) })
        ] }) })
      ] }, item.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        title: editingItem ? "Edit Item" : "Add Item",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost", onClick: () => setIsModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: handleSave, disabled: createItem.isPending || updateItem.isPending, children: createItem.isPending || updateItem.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { size: 16, className: "animate-spin mr-2 inline" }),
            " Saving..."
          ] }) : "Save" })
        ] }),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Item Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: "form-input", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "E.g. Cement, Steel Pipe" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Unit Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: "form-input", value: formData.unit, onChange: (e) => setFormData({ ...formData, unit: e.target.value }), placeholder: "E.g. Bags, Meters" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Unit Size (multiplier)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.01", className: "form-input", value: formData.unitSize, onChange: (e) => setFormData({ ...formData, unitSize: Number(e.target.value) }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Bought Price (Rs)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.01", className: "form-input", value: formData.boughtPrice, onChange: (e) => setFormData({ ...formData, boughtPrice: Number(e.target.value) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Sold Price (Rs)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.01", className: "form-input", value: formData.soldPrice, onChange: (e) => setFormData({ ...formData, soldPrice: Number(e.target.value) }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Initial Quantity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", className: "form-input", value: formData.quantity, onChange: (e) => setFormData({ ...formData, quantity: Number(e.target.value) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Low Stock Threshold" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", className: "form-input", value: formData.lowStockThreshold, onChange: (e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) }) })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        isOpen: isConfirmOpen,
        onClose: () => setIsConfirmOpen(false),
        onConfirm: handleDelete,
        title: "Delete Item",
        message: "Are you sure you want to delete this inventory item? This cannot be undone.",
        isPending: deleteItem.isPending
      }
    )
  ] });
};
export {
  InventoryPage,
  InventoryPage as default
};
