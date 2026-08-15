import { c as createLucideIcon, b as useParams, u as useNavigate, r as reactExports, j as jsxRuntimeExports, z as zt } from "./index-BvumJaAs.js";
import { u as useQuery, _ as getWorker, $ as getAttendance, a0 as getSalaries } from "./index-MsCQlR0B.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-CfVOz41m.js";
import { E as EmptyState } from "./EmptyState-wZU2_9Zt.js";
import { A as ArrowLeft } from "./arrow-left-Z22Cy2p_.js";
import { P as Pen } from "./pen-BkCsVaRE.js";
import { C as Clock } from "./clock-C6JZXPi9.js";
import { D as Download } from "./download-C4B-gW11.js";
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarDays = createLucideIcon("CalendarDays", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
]);
function WorkerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = reactExports.useState("attendance");
  const [attMonth, setAttMonth] = reactExports.useState((/* @__PURE__ */ new Date()).getMonth() + 1);
  const [attYear, setAttYear] = reactExports.useState((/* @__PURE__ */ new Date()).getFullYear());
  const { data: worker, isLoading: loadingWorker } = useQuery({
    queryKey: ["worker", id],
    queryFn: () => getWorker(id)
  });
  const startDate = `${attYear}-${String(attMonth).padStart(2, "0")}-01`;
  const endDate = new Date(attYear, attMonth, 0).toISOString().split("T")[0];
  const { data: attendance, isLoading: loadingAtt } = useQuery({
    queryKey: ["attendance", id, startDate, endDate],
    queryFn: () => getAttendance({ workerId: id, startDate, endDate }),
    enabled: activeTab === "attendance"
  });
  const { data: allSalaries, isLoading: loadingSal } = useQuery({
    queryKey: ["salaries"],
    queryFn: getSalaries,
    enabled: activeTab === "salary"
  });
  const salaries = allSalaries?.filter((s) => s.workerId === id) || [];
  const downloadPaysheet = async (salaryId) => {
    try {
      const token = localStorage.getItem("sg_token") || "";
      const res = await fetch(`http://localhost:3001/api/salary/${salaryId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to download PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `paysheet-${salaryId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      zt.error("Failed to download paysheet");
    }
  };
  if (loadingWorker) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 4 });
  if (!worker) return /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Worker not found", message: "This worker may have been removed." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "1rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate("/workers"), className: "btn btn-ghost btn-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "page-title", children: "Worker Profile" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-worker-id", style: { fontSize: "0.9rem", padding: "0.35rem 0.75rem" }, children: worker.workerId }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.4rem", fontWeight: 600, color: "var(--text-primary)" }, children: worker.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "var(--text-secondary)", marginBottom: "0.25rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "var(--text-primary)" }, children: "Phone:" }),
          " ",
          worker.phone
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "var(--text-secondary)", marginBottom: "0.75rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "var(--text-primary)" }, children: "Address:" }),
          " ",
          worker.address
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "1rem", alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${worker.rateType === "DAILY" ? "badge-in-progress" : "badge-active"}`, children: worker.rateType }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 500, fontSize: "1.05rem", color: "var(--primary)" }, children: [
            worker.rate.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            " LKR/",
            worker.rateType === "DAILY" ? "day" : "month"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-secondary btn-sm", onClick: () => navigate("/workers"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 16 }),
        " Edit Info"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tabs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `tab ${activeTab === "attendance" ? "active" : ""}`, onClick: () => setActiveTab("attendance"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 16, style: { display: "inline", marginRight: "0.4rem", verticalAlign: -3 } }),
        " Attendance History"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `tab ${activeTab === "salary" ? "active" : ""}`, onClick: () => setActiveTab("salary"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 16, style: { display: "inline", marginRight: "0.4rem", verticalAlign: -3 } }),
        " Salary History"
      ] })
    ] }),
    activeTab === "attendance" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "1rem", marginBottom: "1rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "form-select", style: { maxWidth: 160 }, value: attMonth, onChange: (e) => setAttMonth(Number(e.target.value)), children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i + 1, children: new Date(0, i).toLocaleString("default", { month: "long" }) }, i + 1)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "form-select", style: { maxWidth: 120 }, value: attYear, onChange: (e) => setAttYear(Number(e.target.value)), children: [2024, 2025, 2026, 2027].map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: y, children: y }, y)) })
      ] }),
      loadingAtt ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 4 }) : !attendance || attendance.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No records found", message: "No attendance records for this period." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Advance Given (LKR)" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: attendance.map((att) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: new Date(att.date).toLocaleDateString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: att.present ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-completed", children: "Present" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-rejected", children: "Absent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: att.advanceGiven?.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00" })
        ] }, att.id)) })
      ] }) })
    ] }),
    activeTab === "salary" && (loadingSal ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 4 }) : salaries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "No salary records found", message: "No salary history for this worker yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Period" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Days Worked" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Base Pay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Bonuses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Deductions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Advances" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Net Pay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Paysheet" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: salaries.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: [
          new Date(0, s.month - 1).toLocaleString("default", { month: "short" }),
          " ",
          s.year
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: s.daysWorked }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: s.basePay?.toLocaleString("en-LK", { minimumFractionDigits: 2 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { color: "var(--success)" }, children: [
          "+",
          s.bonuses?.toLocaleString("en-LK", { minimumFractionDigits: 2 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { color: "var(--danger)" }, children: [
          "-",
          s.deductions?.toLocaleString("en-LK", { minimumFractionDigits: 2 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { color: "var(--warning)" }, children: [
          "-",
          s.advancesTotal?.toLocaleString("en-LK", { minimumFractionDigits: 2 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)" }, children: s.netPay?.toLocaleString("en-LK", { minimumFractionDigits: 2 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => downloadPaysheet(s.id), className: "btn btn-secondary btn-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }),
          " Download PDF"
        ] }) })
      ] }, s.id)) })
    ] }) }))
  ] });
}
export {
  WorkerDetailPage as default
};
