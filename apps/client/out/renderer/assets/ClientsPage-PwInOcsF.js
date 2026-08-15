import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, U as Users } from "./index-BvumJaAs.js";
import { P as PageHeader } from "./PageHeader-F5xlwJlO.js";
import { S as SearchInput } from "./SearchInput-Bswnjgid.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-CfVOz41m.js";
import { E as EmptyState } from "./EmptyState-wZU2_9Zt.js";
import { M as Modal } from "./Modal-CLdpVs9h.js";
import { C as ConfirmDialog } from "./ConfirmDialog-DmCsxGyN.js";
import { a as useClients, b as useCreateClient, c as useUpdateClient, d as useDeleteClient } from "./index-D6YZuVUF.js";
import { P as Plus } from "./plus-BjNY8XxN.js";
import { P as Pen } from "./pen-BkCsVaRE.js";
import { T as Trash2 } from "./trash-2-BdJQzDNY.js";
import { L as LoaderCircle } from "./loader-circle-BgPef-d6.js";
import "./index-MsCQlR0B.js";
import "./useMutation-GA9qKVkW.js";
const ClientsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const { data: clients, isLoading } = useClients(search);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const [editingClient, setEditingClient] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({ name: "", phone: "", address: "" });
  const [isConfirmOpen, setIsConfirmOpen] = reactExports.useState(false);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const handleOpenModal = (client) => {
    if (client) {
      setEditingClient(client);
      setFormData({ name: client.name, phone: client.phone, address: client.address });
    } else {
      setEditingClient(null);
      setFormData({ name: "", phone: "", address: "" });
    }
    setIsModalOpen(true);
  };
  const handleSave = () => {
    if (editingClient) {
      updateClient.mutate({ id: editingClient.id, data: formData }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createClient.mutate(formData, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };
  const handleDelete = () => {
    if (deletingId) {
      deleteClient.mutate(deletingId, {
        onSuccess: () => setIsConfirmOpen(false)
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Clients",
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-primary", onClick: () => handleOpenModal(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
          " Add Client"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "1.5rem" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchInput, { value: search, onChange: setSearch, placeholder: "Search clients by name, phone..." }) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 5 }) : !clients || clients.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, {}),
        title: "No clients found",
        message: search ? "Try adjusting your search query." : "Get started by adding your first client."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Projects" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Quotations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Invoices" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: clients.map((client) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { cursor: "pointer" }, onClick: () => navigate(`/clients/${client.id}`), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: client.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: client.phone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: client.address }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: client._count?.projects || 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: client._count?.quotations || 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: client._count?.invoices || 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "0.5rem", justifyContent: "flex-end" }, onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost btn-sm", onClick: () => handleOpenModal(client), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost btn-sm", style: { color: "var(--danger)" }, onClick: () => {
            setDeletingId(client.id);
            setIsConfirmOpen(true);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }) })
        ] }) })
      ] }, client.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Modal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        title: editingClient ? "Edit Client" : "Add Client",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost", onClick: () => setIsModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: handleSave, disabled: createClient.isPending || updateClient.isPending, children: createClient.isPending || updateClient.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin mr-2 inline" }),
            " Saving..."
          ] }) : "Save" })
        ] }),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                autoFocus: true,
                type: "text",
                className: "form-input",
                value: formData.name,
                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                placeholder: "John Doe"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                className: "form-input",
                value: formData.phone,
                onChange: (e) => setFormData({ ...formData, phone: e.target.value }),
                placeholder: "07X XXX XXXX"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: "form-textarea",
                value: formData.address,
                onChange: (e) => setFormData({ ...formData, address: e.target.value }),
                placeholder: "Full Address"
              }
            )
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
        title: "Delete Client",
        message: "Are you sure you want to delete this client? This action cannot be undone.",
        isPending: deleteClient.isPending
      }
    )
  ] });
};
export {
  ClientsPage,
  ClientsPage as default
};
