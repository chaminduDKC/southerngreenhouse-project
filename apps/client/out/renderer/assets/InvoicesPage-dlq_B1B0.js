import { u as useNavigate, d as useQueryClient, r as reactExports, j as jsxRuntimeExports, e as Receipt, z as zt } from "./index-BvumJaAs.js";
import { u as useQuery, S as deleteInvoice, T as getInvoices } from "./index-MsCQlR0B.js";
import { u as useMutation } from "./useMutation-GA9qKVkW.js";
import { P as PageHeader } from "./PageHeader-F5xlwJlO.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-CfVOz41m.js";
import { E as EmptyState } from "./EmptyState-wZU2_9Zt.js";
import { C as ConfirmDialog } from "./ConfirmDialog-DmCsxGyN.js";
import { P as Plus } from "./plus-BjNY8XxN.js";
import { D as Download } from "./download-C4B-gW11.js";
import { P as Pen } from "./pen-BkCsVaRE.js";
import { T as Trash2 } from "./trash-2-BdJQzDNY.js";
import "./Modal-CLdpVs9h.js";
import "./loader-circle-BgPef-d6.js";
function InvoicesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isConfirmOpen, setIsConfirmOpen] = reactExports.useState(false);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices
  });
  const deleteMutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      zt.success("Invoice deleted");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setIsConfirmOpen(false);
    },
    onError: () => zt.error("Failed to delete invoice")
  });
  const downloadPDF = async (id) => {
    try {
      const token = localStorage.getItem("sg_token") || "";
      const res = await fetch(`http://localhost:3001/api/invoices/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      zt.error("Failed to download PDF");
    }
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
        title: "Invoices",
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-primary", onClick: () => navigate("/invoices/new"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
          " New Invoice"
        ] })
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 5 }) : !invoices || invoices.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, {}),
        title: "No invoices found",
        message: "Get started by creating your first invoice."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Client" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Project" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Total Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Amount Due" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Due Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: invoices.map((inv, i) => {
        const isOverdue = new Date(inv.dueDate) < /* @__PURE__ */ new Date() && inv.amountDue > 0;
        const isPaid = inv.amountDue === 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: isOverdue ? "overdue-row" : "",
            style: { cursor: "pointer" },
            onClick: () => navigate(`/invoices/${inv.id}/edit`),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: i + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: inv.client?.name || "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: inv.project?.title || "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: inv.totalAmount?.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: inv.amountDue?.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: new Date(inv.dueDate).toLocaleDateString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: isOverdue ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-rejected", children: "Overdue" }) : isPaid ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-completed", children: "Paid" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-on-hold", children: "Pending" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "0.5rem", justifyContent: "flex-end" }, onClick: (e) => e.stopPropagation(), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => downloadPDF(inv.id), className: "btn btn-ghost btn-sm", title: "Download PDF", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(`/invoices/${inv.id}/edit`), className: "btn btn-ghost btn-sm", title: "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 16 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      setDeletingId(inv.id);
                      setIsConfirmOpen(true);
                    },
                    className: "btn btn-ghost btn-sm",
                    style: { color: "var(--danger)" },
                    title: "Delete",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
                  }
                )
              ] }) })
            ]
          },
          inv.id
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        isOpen: isConfirmOpen,
        onClose: () => setIsConfirmOpen(false),
        onConfirm: handleDelete,
        title: "Delete Invoice",
        message: "Are you sure you want to delete this invoice? This action cannot be undone.",
        isPending: deleteMutation.isPending
      }
    )
  ] });
}
export {
  InvoicesPage as default
};
