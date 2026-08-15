import { c as createLucideIcon, u as useNavigate, r as reactExports, j as jsxRuntimeExports, B as BookOpen, z as zt } from "./index-BvumJaAs.js";
import { P as PageHeader } from "./PageHeader-F5xlwJlO.js";
import { E as EmptyState } from "./EmptyState-wZU2_9Zt.js";
import { M as Modal } from "./Modal-CLdpVs9h.js";
import { C as ConfirmDialog } from "./ConfirmDialog-DmCsxGyN.js";
import { E as useLedger, F as useDeleteLedgerEntry } from "./index-D6YZuVUF.js";
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
const Eye = createLucideIcon("Eye", [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
function LedgerPage() {
  const navigate = useNavigate();
  const [page, setPage] = reactExports.useState(1);
  const { data: pagedData, isLoading } = useLedger(page, 10);
  const deleteEntry = useDeleteLedgerEntry();
  const [selectedEntry, setSelectedEntry] = reactExports.useState(null);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const formatCurrency = (val) => (val || 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteEntry.mutateAsync(deletingId);
      zt.success("Deleted successfully");
      setDeletingId(null);
    } catch (err) {
      zt.error(err.message || "Failed to delete");
    }
  };
  const entries = pagedData?.data || [];
  const totalPages = pagedData?.totalPages || 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Daily Ledger",
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-primary", onClick: () => navigate("/ledger/new"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
          " New Entry"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", style: { padding: 0, overflow: "hidden" }, children: [
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }, children: "Loading ledger..." }) : entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, {}), title: "No ledger entries found", message: "Create your first entry to start tracking daily balances." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", style: { margin: 0, border: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Opening Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Payment Given" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Return" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Cost" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center", width: 140 }, children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: entries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            style: entry.isLatest ? { background: "rgba(34,197,94,0.05)" } : void 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { fontWeight: 500, color: "var(--text-primary)", borderLeft: entry.isLatest ? "3px solid var(--success)" : void 0 }, children: [
                new Date(entry.date).toLocaleDateString(),
                entry.isLatest && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-active", style: { marginLeft: "0.5rem", fontSize: "0.65rem" }, children: "Latest" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { textAlign: "right" }, children: [
                "LKR ",
                formatCurrency(entry.openingBalance)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { textAlign: "right", color: "var(--accent)" }, children: [
                "LKR ",
                formatCurrency(entry.paymentGivenToday)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { textAlign: "right", color: "var(--success)" }, children: [
                "LKR ",
                formatCurrency(entry.balanceReturnedToday)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { textAlign: "right", fontWeight: 600, color: "var(--danger)" }, children: [
                "LKR ",
                formatCurrency(entry.cost)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", gap: "0.25rem" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost btn-sm", style: { padding: "0.4rem" }, onClick: () => setSelectedEntry(entry), title: "View", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }) }),
                entry.isLatest && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost btn-sm", style: { padding: "0.4rem", color: "var(--accent)" }, onClick: () => navigate(`/ledger/${entry.id}/edit`), title: "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 16 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost btn-sm", style: { padding: "0.4rem", color: "var(--danger)" }, onClick: () => setDeletingId(entry.id), title: "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }) })
                ] })
              ] }) })
            ]
          },
          entry.id
        )) })
      ] }) }),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pagination", style: { justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary btn-sm", disabled: page === 1, onClick: () => setPage((p) => Math.max(1, p - 1)), children: "Prev" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { padding: "0 1rem", fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)" }, children: [
          "Page ",
          page,
          " of ",
          totalPages
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary btn-sm", disabled: page === totalPages, onClick: () => setPage((p) => Math.min(totalPages, p + 1)), children: "Next" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: !!selectedEntry,
        onClose: () => setSelectedEntry(null),
        title: selectedEntry ? `Ledger Entry: ${new Date(selectedEntry.date).toLocaleDateString()}` : "",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: () => setSelectedEntry(null), children: "Close" }),
        children: selectedEntry && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1.5rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, minmax(120px, 1fr))", gap: "1rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }, children: "Opening Balance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: 600, color: "var(--text-primary)" }, children: [
                "LKR ",
                formatCurrency(selectedEntry.openingBalance)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0.75rem", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "var(--radius-sm)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.75rem", color: "var(--accent)", marginBottom: "0.25rem" }, children: "Payment Given" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: 600, color: "var(--accent)" }, children: [
                "LKR ",
                formatCurrency(selectedEntry.paymentGivenToday)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0.75rem", background: "var(--primary-glow)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius-sm)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.75rem", color: "var(--success)", marginBottom: "0.25rem" }, children: "Balance Returned" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: 600, color: "var(--success)" }, children: [
                "LKR ",
                formatCurrency(selectedEntry.balanceReturnedToday)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0.75rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "var(--radius-sm)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.75rem", color: "var(--danger)", marginBottom: "0.25rem" }, children: "Total Cost" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: 600, color: "var(--danger)" }, children: [
                "LKR ",
                formatCurrency(selectedEntry.cost)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border)" }, children: "Worker Advances" }),
            selectedEntry.workerAdvances && selectedEntry.workerAdvances.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: { width: "100%", fontSize: "0.85rem" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { textAlign: "left", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { paddingBottom: "0.5rem", fontWeight: 500 }, children: "Worker" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { paddingBottom: "0.5rem", fontWeight: 500 }, children: "Project/Target" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { paddingBottom: "0.5rem", fontWeight: 500, textAlign: "right" }, children: "Advance Amount" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: selectedEntry.workerAdvances.map((adv, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { borderBottom: "1px solid var(--border)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "0.5rem 0", color: "var(--text-primary)" }, children: adv.workerName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { padding: "0.5rem 0" }, children: adv.targetTitle ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: "0.4rem" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chip", children: adv.targetType?.replace("_", " ") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-secondary)" }, children: adv.targetTitle })
                ] }) : "-" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { padding: "0.5rem 0", textAlign: "right", fontWeight: 500, color: "var(--warning)" }, children: [
                  "LKR ",
                  formatCurrency(adv.advanceAmount)
                ] })
              ] }, i)) })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }, children: "No worker advances recorded." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border)" }, children: "Cost Allocation to Completed Projects" }),
            selectedEntry.allocatedProjects && selectedEntry.allocatedProjects.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: selectedEntry.allocatedProjects.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.85rem" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 6, height: 6, borderRadius: "50%", background: "var(--primary)" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chip", children: p.targetType?.replace("_", " ") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: p.targetTitle || p.targetId })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: 600, color: "var(--danger)" }, children: [
                "+ LKR ",
                formatCurrency(p.amount)
              ] })
            ] }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }, children: "Cost was not allocated to any projects." })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        isOpen: !!deletingId,
        onClose: () => setDeletingId(null),
        onConfirm: handleDelete,
        title: "Delete Ledger Entry",
        message: "Delete this ledger entry? This can only be done for the latest entry, and cannot be undone.",
        isPending: deleteEntry.isPending
      }
    )
  ] });
}
export {
  LedgerPage as default
};
