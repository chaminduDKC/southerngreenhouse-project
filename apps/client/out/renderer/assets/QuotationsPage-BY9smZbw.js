import { u as useNavigate, d as useQueryClient, r as reactExports, j as jsxRuntimeExports, F as FileText, z as zt } from "./index-BvumJaAs.js";
import { u as useQuery, N as deleteQuotation, O as getQuotations } from "./index-MsCQlR0B.js";
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
function QuotationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = reactExports.useState("ALL");
  const [isConfirmOpen, setIsConfirmOpen] = reactExports.useState(false);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const { data: quotations, isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: getQuotations
  });
  const deleteMutation = useMutation({
    mutationFn: deleteQuotation,
    onSuccess: () => {
      zt.success("Quotation deleted");
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      setIsConfirmOpen(false);
    },
    onError: () => zt.error("Failed to delete quotation")
  });
  const downloadPDF = async (id) => {
    try {
      const token = localStorage.getItem("sg_token") || "";
      const res = await fetch(`http://localhost:3001/api/quotations/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quotation-${id}.pdf`;
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
  const filtered = quotations?.filter((q) => statusFilter === "ALL" || q.status === statusFilter) || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Quotations",
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-primary", onClick: () => navigate("/quotations/new"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
          " New Quotation"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "1.5rem" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "select",
      {
        className: "form-select",
        style: { maxWidth: 200 },
        value: statusFilter,
        onChange: (e) => setStatusFilter(e.target.value),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "All Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "DRAFT", children: "Draft" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SENT", children: "Sent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ACCEPTED", children: "Accepted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "REJECTED", children: "Rejected" })
        ]
      }
    ) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 5 }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, {}),
        title: "No quotations found",
        message: statusFilter !== "ALL" ? "Try a different status filter." : "Get started by creating your first quotation."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Client" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Project" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Valid Until" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { cursor: "pointer" }, onClick: () => navigate(`/quotations/${q.id}/edit`), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: i + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: q.client?.name || "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: q.project?.title || "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: new Date(q.validUntil).toLocaleDateString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: q.total?.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge badge-${q.status.toLowerCase()}`, children: q.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "0.5rem", justifyContent: "flex-end" }, onClick: (e) => e.stopPropagation(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => downloadPDF(q.id), className: "btn btn-ghost btn-sm", title: "Download PDF", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(`/quotations/${q.id}/edit`), className: "btn btn-ghost btn-sm", title: "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                setDeletingId(q.id);
                setIsConfirmOpen(true);
              },
              className: "btn btn-ghost btn-sm",
              style: { color: "var(--danger)" },
              title: "Delete",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
            }
          )
        ] }) })
      ] }, q.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        isOpen: isConfirmOpen,
        onClose: () => setIsConfirmOpen(false),
        onConfirm: handleDelete,
        title: "Delete Quotation",
        message: "Are you sure you want to delete this quotation? This action cannot be undone.",
        isPending: deleteMutation.isPending
      }
    )
  ] });
}
export {
  QuotationsPage as default
};
