import { c as createLucideIcon, d as useQueryClient, r as reactExports, j as jsxRuntimeExports, z as zt } from "./index-BvumJaAs.js";
import { u as useQuery, a4 as calculateSalary, a5 as saveSalary, a6 as updateSalary, M as getWorkers, a0 as getSalaries } from "./index-MsCQlR0B.js";
import { u as useMutation } from "./useMutation-GA9qKVkW.js";
import { P as PageHeader } from "./PageHeader-F5xlwJlO.js";
import { E as EmptyState } from "./EmptyState-wZU2_9Zt.js";
import { M as Modal } from "./Modal-CLdpVs9h.js";
import { C as CircleCheckBig } from "./circle-check-big-B3S83hcW.js";
import { P as Pen } from "./pen-BkCsVaRE.js";
import { D as Download } from "./download-C4B-gW11.js";
import { S as Save } from "./save-BFlD0_Q1.js";
import { P as Plus } from "./plus-BjNY8XxN.js";
import { L as LoaderCircle } from "./loader-circle-BgPef-d6.js";
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Calculator = createLucideIcon("Calculator", [
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2", key: "1nb95v" }],
  ["line", { x1: "8", x2: "16", y1: "6", y2: "6", key: "x4nwl0" }],
  ["line", { x1: "16", x2: "16", y1: "14", y2: "18", key: "wjye3r" }],
  ["path", { d: "M16 10h.01", key: "1m94wz" }],
  ["path", { d: "M12 10h.01", key: "1nrarc" }],
  ["path", { d: "M8 10h.01", key: "19clt8" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Minus = createLucideIcon("Minus", [["path", { d: "M5 12h14", key: "1ays0h" }]]);
const fmt = (v) => (v ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function SalaryPage() {
  const queryClient = useQueryClient();
  const currentDate = /* @__PURE__ */ new Date();
  const [month, setMonth] = reactExports.useState(currentDate.getMonth() + 1);
  const [year, setYear] = reactExports.useState(currentDate.getFullYear());
  const { data: workers } = useQuery({ queryKey: ["workers"], queryFn: getWorkers });
  const { data: salaries } = useQuery({ queryKey: ["salaries"], queryFn: getSalaries });
  const [calcRows, setCalcRows] = reactExports.useState([]);
  const [isCalculating, setIsCalculating] = reactExports.useState(false);
  const [adjustRow, setAdjustRow] = reactExports.useState(null);
  const [addBonus, setAddBonus] = reactExports.useState(0);
  const [addDeduction, setAddDeduction] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (salaries && workers) {
      const forPeriod = salaries.filter((s) => s.month === month && s.year === year);
      const rows = workers.map((w) => {
        const existing = forPeriod.find((s) => s.workerId === w.id);
        if (existing) {
          return {
            ...existing,
            isSaved: true,
            workerName: w.name,
            workerIdStr: w.workerId,
            // ensure numbers (Prisma Decimal comes as string sometimes)
            basePay: Number(existing.basePay),
            advancesTotal: Number(existing.advancesTotal),
            bonuses: Number(existing.bonuses),
            deductions: Number(existing.deductions),
            netPay: Number(existing.netPay)
          };
        }
        return null;
      }).filter(Boolean);
      if (rows.length > 0) setCalcRows(rows);
    }
  }, [salaries, month, year, workers]);
  reactExports.useEffect(() => {
    setCalcRows([]);
  }, [month, year]);
  const calculateAll = async () => {
    if (!workers) return;
    setIsCalculating(true);
    try {
      const results = [];
      for (const w of workers) {
        const result = await calculateSalary({ workerId: w.id, month, year });
        const saved = salaries?.find((s) => s.workerId === w.id && s.month === month && s.year === year);
        results.push({
          ...result,
          workerId: w.id,
          workerName: w.name,
          workerIdStr: w.workerId,
          basePay: Number(result.basePay),
          advancesTotal: Number(result.advancesTotal),
          bonuses: saved ? Number(saved.bonuses) : 0,
          deductions: saved ? Number(saved.deductions) : 0,
          netPay: saved ? Number(saved.netPay) : Number(result.basePay) - Number(result.advancesTotal),
          id: saved?.id,
          isSaved: !!saved
        });
      }
      setCalcRows(results);
    } catch {
      zt.error("Failed to calculate salaries");
    } finally {
      setIsCalculating(false);
    }
  };
  const saveMutation = useMutation({
    mutationFn: saveSalary,
    onSuccess: () => {
      zt.success("Salary saved");
      queryClient.invalidateQueries({ queryKey: ["salaries"] });
    },
    onError: () => zt.error("Failed to save salary")
  });
  const handleSave = (row) => {
    saveMutation.mutate({
      workerId: row.workerId,
      month,
      year,
      daysWorked: row.daysWorked,
      basePay: row.basePay,
      bonuses: row.bonuses,
      deductions: row.deductions,
      advancesTotal: row.advancesTotal,
      netPay: row.netPay
    });
  };
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSalary(id, data),
    onSuccess: () => {
      zt.success("Salary updated");
      queryClient.invalidateQueries({ queryKey: ["salaries"] });
      setAdjustRow(null);
      setAddBonus(0);
      setAddDeduction(0);
    },
    onError: () => zt.error("Failed to update salary")
  });
  const openAdjust = (row) => {
    setAdjustRow(row);
    setAddBonus(0);
    setAddDeduction(0);
  };
  const adjustedBonuses = (adjustRow?.bonuses ?? 0) + addBonus;
  const adjustedDeductions = (adjustRow?.deductions ?? 0) + addDeduction;
  const adjustedNetPay = (adjustRow?.basePay ?? 0) + adjustedBonuses - adjustedDeductions - (adjustRow?.advancesTotal ?? 0);
  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (!adjustRow?.id) return;
    updateMutation.mutate({
      id: adjustRow.id,
      data: {
        bonuses: adjustedBonuses,
        deductions: adjustedDeductions,
        netPay: adjustedNetPay
      }
    });
  };
  const handleUpdateRow = (index, field, value) => {
    const rows = [...calcRows];
    rows[index][field] = value;
    const r = rows[index];
    r.netPay = r.basePay + Number(r.bonuses || 0) - Number(r.deductions || 0) - r.advancesTotal;
    setCalcRows(rows);
  };
  const downloadPaysheet = async (salaryId, workerName) => {
    try {
      const token = localStorage.getItem("sg_token") || "";
      const res = await fetch(`http://localhost:3001/api/salary/${salaryId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `paysheet-${workerName}-${month}-${year}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      zt.error("Failed to download paysheet");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Salary Management",
        subtitle: `${new Date(year, month - 1).toLocaleString("default", { month: "long" })} ${year}`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", style: { display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "1rem", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { fontWeight: 500, color: "var(--text-secondary)" }, children: "Period:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "form-select", style: { maxWidth: 170 }, value: month, onChange: (e) => setMonth(Number(e.target.value)), children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i + 1, children: new Date(0, i).toLocaleString("default", { month: "long" }) }, i + 1)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "form-select", style: { maxWidth: 120 }, value: year, onChange: (e) => setYear(Number(e.target.value)), children: [2024, 2025, 2026, 2027].map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: y, children: y }, y)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: calculateAll, className: "btn btn-primary", disabled: isCalculating || !workers, children: isCalculating ? "Calculating…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { size: 18 }),
        " Calculate All"
      ] }) }),
      calcRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "auto" }, children: [
        calcRows.filter((r) => r.isSaved).length,
        "/",
        calcRows.length,
        " saved"
      ] })
    ] }),
    calcRows.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Worker" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center" }, children: "Days" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Base Pay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Advances" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Bonuses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Deductions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Net Pay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "center", width: 160 }, children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: calcRows.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: row.isSaved ? { background: "rgba(34,197,94,0.03)" } : void 0, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: row.workerName }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center", fontWeight: 600 }, children: row.daysWorked }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { textAlign: "right" }, children: [
          "LKR ",
          fmt(row.basePay)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right", color: "var(--warning)" }, children: row.advancesTotal > 0 ? `LKR ${fmt(row.advancesTotal)}` : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: row.isSaved ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--success)", fontWeight: 500 }, children: row.bonuses > 0 ? `LKR ${fmt(row.bonuses)}` : "—" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            min: "0",
            step: "100",
            className: "form-input",
            style: { textAlign: "right", color: "var(--success)", fontWeight: 500, maxWidth: 130 },
            value: row.bonuses,
            onChange: (e) => handleUpdateRow(i, "bonuses", Number(e.target.value))
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: row.isSaved ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: row.deductions > 0 ? "var(--danger)" : "var(--text-muted)", fontWeight: 500 }, children: row.deductions > 0 ? `LKR ${fmt(row.deductions)}` : "—" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            min: "0",
            step: "100",
            className: "form-input",
            style: { textAlign: "right", color: "var(--danger)", fontWeight: 500, maxWidth: 130 },
            value: row.deductions,
            onChange: (e) => handleUpdateRow(i, "deductions", Number(e.target.value))
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { textAlign: "right", fontWeight: 700, fontSize: "1.05rem", color: "var(--primary)" }, children: [
          "LKR ",
          fmt(row.netPay)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: row.isSaved ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 16, color: "var(--success)", title: "Saved" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn btn-ghost btn-sm",
              style: { color: "var(--accent)", padding: "0.3rem 0.5rem" },
              onClick: () => openAdjust(row),
              title: "Add bonus / deduction",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { size: 14 }),
                " Adjust"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn btn-ghost btn-sm",
              style: { padding: "0.3rem" },
              onClick: () => downloadPaysheet(row.id, row.workerName),
              title: "Download Paysheet PDF",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14 })
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => handleSave(row),
            className: "btn btn-primary btn-sm",
            style: { width: "100%" },
            disabled: saveMutation.isPending,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 15 }),
              " Save"
            ]
          }
        ) })
      ] }, row.workerId)) })
    ] }) }) : !isCalculating && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, {}),
        title: "No Salary Data Loaded",
        message: `Click "Calculate All" to load salary data for ${new Date(year, month - 1).toLocaleString("default", { month: "long", year: "numeric" })}`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        isOpen: !!adjustRow,
        onClose: () => {
          setAdjustRow(null);
          setAddBonus(0);
          setAddDeduction(0);
        },
        title: `Adjust — ${adjustRow?.workerName}`,
        size: "sm",
        footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost", onClick: () => {
            setAdjustRow(null);
            setAddBonus(0);
            setAddDeduction(0);
          }, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", form: "adjust-form", type: "submit", disabled: updateMutation.isPending, children: updateMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin mr-2 inline" }),
            " Saving…"
          ] }) : "Apply & Save" })
        ] }),
        children: adjustRow && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { id: "adjust-form", onSubmit: handleAdjustSubmit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "0.9rem 1rem",
            marginBottom: "1.25rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem 1.5rem",
            fontSize: "0.85rem"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--text-muted)" }, children: "Base Pay" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right", fontWeight: 600 }, children: [
              "LKR ",
              fmt(adjustRow.basePay)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--text-muted)" }, children: "Advances" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right", color: "var(--warning)" }, children: [
              "— LKR ",
              fmt(adjustRow.advancesTotal)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--success)" }, children: "Current Bonuses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right", color: "var(--success)", fontWeight: 600 }, children: [
              "LKR ",
              fmt(adjustRow.bonuses)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--danger)" }, children: "Current Deductions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right", color: "var(--danger)", fontWeight: 600 }, children: [
              "LKR ",
              fmt(adjustRow.deductions)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "form-label", style: { display: "flex", alignItems: "center", gap: "0.4rem" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, color: "var(--success)" }),
              " Add Bonus (LKR)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                autoFocus: true,
                type: "number",
                min: "0",
                step: "100",
                className: "form-input",
                value: addBonus,
                onChange: (e) => setAddBonus(Number(e.target.value)),
                placeholder: "0"
              }
            ),
            addBonus > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.78rem", color: "var(--success)", marginTop: "0.25rem" }, children: [
              "Total bonuses will be: LKR ",
              fmt(adjustedBonuses)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "form-label", style: { display: "flex", alignItems: "center", gap: "0.4rem" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 14, color: "var(--danger)" }),
              " Add Deduction (LKR)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                min: "0",
                step: "100",
                className: "form-input",
                value: addDeduction,
                onChange: (e) => setAddDeduction(Number(e.target.value)),
                placeholder: "0"
              }
            ),
            addDeduction > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.78rem", color: "var(--danger)", marginTop: "0.25rem" }, children: [
              "Total deductions will be: LKR ",
              fmt(adjustedDeductions)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "var(--radius-sm)",
            padding: "0.9rem 1rem",
            marginTop: "0.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 600, color: "var(--text-secondary)" }, children: "New Net Pay" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "1.2rem", fontWeight: 700, color: "var(--primary)" }, children: [
              "LKR ",
              fmt(adjustedNetPay)
            ] })
          ] })
        ] })
      }
    )
  ] });
}
export {
  SalaryPage as default
};
