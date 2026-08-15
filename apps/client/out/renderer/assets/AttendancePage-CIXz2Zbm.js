import { c as createLucideIcon, d as useQueryClient, r as reactExports, j as jsxRuntimeExports, U as Users, z as zt } from "./index-BvumJaAs.js";
import { u as useQuery, a1 as bulkAttendance, a2 as updateAttendance, a3 as deleteAttendance, M as getWorkers, $ as getAttendance } from "./index-MsCQlR0B.js";
import { u as useMutation } from "./useMutation-GA9qKVkW.js";
import { P as PageHeader } from "./PageHeader-F5xlwJlO.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-CfVOz41m.js";
import { E as EmptyState } from "./EmptyState-wZU2_9Zt.js";
import { M as Modal } from "./Modal-CLdpVs9h.js";
import { C as ConfirmDialog } from "./ConfirmDialog-DmCsxGyN.js";
import { S as Save } from "./save-BFlD0_Q1.js";
import { C as Clock } from "./clock-C6JZXPi9.js";
import { P as Pen } from "./pen-BkCsVaRE.js";
import { T as Trash2 } from "./trash-2-BdJQzDNY.js";
import "./loader-circle-BgPef-d6.js";
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Calendar = createLucideIcon("Calendar", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleCheck = createLucideIcon("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleX = createLucideIcon("CircleX", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
]);
function AttendancePage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = reactExports.useState("daily");
  const [selectedDate, setSelectedDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [historyWorkerId, setHistoryWorkerId] = reactExports.useState("");
  const [editRecord, setEditRecord] = reactExports.useState(null);
  const [editForm, setEditForm] = reactExports.useState({ present: true, advanceGiven: 0 });
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const { data: workers } = useQuery({ queryKey: ["workers"], queryFn: getWorkers });
  const { data: dailyAttendance, isLoading: loadingDaily } = useQuery({
    queryKey: ["attendance", "daily", selectedDate],
    queryFn: () => getAttendance({ date: selectedDate })
  });
  const [bulkData, setBulkData] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (workers) {
      const newBulk = {};
      workers.forEach((w) => {
        const record = dailyAttendance?.find((a) => a.workerId === w.id);
        newBulk[w.id] = {
          present: record ? record.present : false,
          advanceGiven: record ? record.advanceGiven || 0 : 0
        };
      });
      setBulkData(newBulk);
    }
  }, [workers, dailyAttendance]);
  const bulkMutation = useMutation({
    mutationFn: bulkAttendance,
    onSuccess: () => {
      zt.success("Attendance saved for " + selectedDate);
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: () => zt.error("Failed to save attendance")
  });
  const handleSaveBulk = () => {
    const records = Object.entries(bulkData).map(([workerId, data]) => ({
      workerId,
      present: data.present,
      advanceGiven: data.advanceGiven
    }));
    bulkMutation.mutate({ date: selectedDate, records });
  };
  const { data: historyAttendance, isLoading: loadingHistory } = useQuery({
    queryKey: ["attendance", "history", historyWorkerId],
    queryFn: () => getAttendance(historyWorkerId ? { workerId: historyWorkerId } : {}),
    enabled: activeTab === "history"
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateAttendance(id, data),
    onSuccess: () => {
      zt.success("Attendance updated");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      setEditRecord(null);
    },
    onError: () => zt.error("Failed to update attendance")
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAttendance(id),
    onSuccess: () => {
      zt.success("Attendance record deleted");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      setDeleteId(null);
    },
    onError: () => zt.error("Failed to delete attendance")
  });
  const openEdit = (att) => {
    setEditRecord(att);
    setEditForm({ present: att.present, advanceGiven: att.advanceGiven || 0 });
  };
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editRecord) return;
    updateMutation.mutate({ id: editRecord.id, data: editForm });
  };
  const fmt = (v) => v?.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "0.00";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Attendance" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tabs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `tab ${activeTab === "daily" ? "active" : ""}`, onClick: () => setActiveTab("daily"), children: "Daily Entry" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `tab ${activeTab === "history" ? "active" : ""}`, onClick: () => setActiveTab("history"), children: "History" })
    ] }),
    activeTab === "daily" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "1rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 18 }),
            " Date:"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              className: "form-input",
              style: { maxWidth: 200 },
              value: selectedDate,
              onChange: (e) => setSelectedDate(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSaveBulk, className: "btn btn-primary", disabled: bulkMutation.isPending || loadingDaily, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
          " Save All"
        ] })
      ] }),
      loadingDaily ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 4 }) : !workers || workers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, {}), title: "No workers found", message: "Add workers first to record attendance." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Worker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Advance Given (LKR)" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: workers.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: w.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.75rem", color: "var(--text-muted)" }, children: [
              w.workerId,
              " · ",
              w.rateType
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setBulkData((prev) => ({ ...prev, [w.id]: { ...prev[w.id], present: !prev[w.id]?.present } })),
              className: "btn btn-sm",
              style: {
                width: 130,
                justifyContent: "center",
                background: bulkData[w.id]?.present ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.08)",
                color: bulkData[w.id]?.present ? "var(--success)" : "var(--danger)",
                border: `1px solid ${bulkData[w.id]?.present ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.2)"}`
              },
              children: bulkData[w.id]?.present ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 15 }),
                " Present"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 15 }),
                " Absent"
              ] })
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              min: "0",
              step: "100",
              className: "form-input",
              style: { maxWidth: 180 },
              value: bulkData[w.id]?.advanceGiven || 0,
              onChange: (e) => setBulkData((prev) => ({ ...prev, [w.id]: { ...prev[w.id], advanceGiven: Number(e.target.value) } }))
            }
          ) })
        ] }, w.id)) })
      ] }) })
    ] }),
    activeTab === "history" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", style: { padding: 0 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "form-select",
            style: { maxWidth: 260 },
            value: historyWorkerId,
            onChange: (e) => setHistoryWorkerId(e.target.value),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All Workers" }),
              workers?.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: w.id, children: [
                w.name,
                " (",
                w.workerId,
                ")"
              ] }, w.id))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", color: "var(--text-muted)" }, children: historyAttendance ? `${historyAttendance.length} record${historyAttendance.length !== 1 ? "s" : ""}` : "" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "1rem" }, children: loadingHistory ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 5 }) : !historyAttendance || historyAttendance.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, {}), title: "No attendance records", message: "Try a different worker filter." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", style: { margin: 0, border: "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Worker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Advance (LKR)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center", width: 100 }, children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: historyAttendance.map((att) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { whiteSpace: "nowrap", fontWeight: 500 }, children: new Date(att.date).toLocaleDateString("en-LK", { day: "2-digit", month: "short", year: "numeric" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { color: "var(--text-primary)", fontWeight: 500 }, children: [
            att.worker?.name || "—",
            att.worker?.workerId && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "0.4rem" }, children: att.worker.workerId })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: att.present ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-completed", children: "Present" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-rejected", children: "Absent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right", color: att.advanceGiven > 0 ? "var(--warning)" : "var(--text-muted)" }, children: att.advanceGiven > 0 ? `LKR ${fmt(att.advanceGiven)}` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", gap: "0.35rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "btn btn-ghost btn-sm",
                style: { padding: "0.35rem" },
                title: "Edit record",
                onClick: () => openEdit(att),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 14 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "btn btn-ghost btn-sm",
                style: { padding: "0.35rem", color: "var(--danger)" },
                title: "Delete record",
                onClick: () => setDeleteId(att.id),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
              }
            )
          ] }) })
        ] }, att.id)) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: !!editRecord,
        onClose: () => setEditRecord(null),
        title: "Edit Attendance Record",
        size: "sm",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost", onClick: () => setEditRecord(null), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", form: "edit-att-form", type: "submit", disabled: updateMutation.isPending, children: updateMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { size: 16, className: "animate-spin mr-2 inline" }),
            " Saving…"
          ] }) : "Save Changes" })
        ] }),
        children: editRecord && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "edit-att-form", onSubmit: handleSaveEdit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "1rem", padding: "0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", color: "var(--text-secondary)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "var(--text-primary)" }, children: editRecord.worker?.name }),
            " · ",
            new Date(editRecord.date).toLocaleDateString("en-LK", { day: "2-digit", month: "long", year: "numeric" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "0.75rem", marginTop: "0.25rem" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "btn btn-sm",
                  style: {
                    flex: 1,
                    justifyContent: "center",
                    background: editForm.present ? "rgba(34,197,94,0.15)" : "var(--surface-2)",
                    color: editForm.present ? "var(--success)" : "var(--text-secondary)",
                    border: `1px solid ${editForm.present ? "rgba(34,197,94,0.4)" : "var(--border)"}`
                  },
                  onClick: () => setEditForm((f) => ({ ...f, present: true })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 15 }),
                    " Present"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "btn btn-sm",
                  style: {
                    flex: 1,
                    justifyContent: "center",
                    background: !editForm.present ? "rgba(239,68,68,0.1)" : "var(--surface-2)",
                    color: !editForm.present ? "var(--danger)" : "var(--text-secondary)",
                    border: `1px solid ${!editForm.present ? "rgba(239,68,68,0.3)" : "var(--border)"}`
                  },
                  onClick: () => setEditForm((f) => ({ ...f, present: false })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 15 }),
                    " Absent"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Advance Given (LKR)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                min: "0",
                step: "100",
                className: "form-input",
                value: editForm.advanceGiven,
                onChange: (e) => setEditForm((f) => ({ ...f, advanceGiven: Number(e.target.value) }))
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        isOpen: !!deleteId,
        onClose: () => setDeleteId(null),
        onConfirm: () => deleteId && deleteMutation.mutate(deleteId),
        title: "Delete Attendance Record",
        message: "Are you sure you want to delete this attendance record? This cannot be undone.",
        isPending: deleteMutation.isPending
      }
    )
  ] });
}
export {
  AttendancePage as default
};
