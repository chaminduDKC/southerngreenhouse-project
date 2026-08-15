import { b as useParams, u as useNavigate, r as reactExports, j as jsxRuntimeExports, z as zt } from "./index-BvumJaAs.js";
import { T as TargetType } from "./index-v-MSDYfl.js";
import { L as LoadingSkeleton } from "./LoadingSkeleton-CfVOz41m.js";
import { G as useLastLedgerEntry, H as useLedgerEntry, I as useWorkers, i as useEligibleAllocationTargets, J as useCreateLedgerEntry, K as useUpdateLedgerEntry } from "./index-D6YZuVUF.js";
import { A as ArrowLeft } from "./arrow-left-Z22Cy2p_.js";
import { P as Plus } from "./plus-BjNY8XxN.js";
import { T as Trash2 } from "./trash-2-BdJQzDNY.js";
import { S as Save } from "./save-BFlD0_Q1.js";
import { L as LoaderCircle } from "./loader-circle-BgPef-d6.js";
import "./index-MsCQlR0B.js";
import "./useMutation-GA9qKVkW.js";
function LedgerEntryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { data: lastEntry } = useLastLedgerEntry();
  const { data: existingEntry, isLoading: loadingExisting } = useLedgerEntry(id || "");
  const { data: workers } = useWorkers();
  const { data: targets } = useEligibleAllocationTargets();
  const createEntry = useCreateLedgerEntry();
  const updateEntry = useUpdateLedgerEntry();
  const [date, setDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [openingBalance, setOpeningBalance] = reactExports.useState(0);
  const [paymentGivenToday, setPaymentGivenToday] = reactExports.useState(0);
  const [balanceReturnedToday, setBalanceReturnedToday] = reactExports.useState(0);
  const [workerAdvances, setWorkerAdvances] = reactExports.useState([]);
  const [completedProjects, setCompletedProjects] = reactExports.useState([]);
  const [allocatedProjects, setAllocatedProjects] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (isEditing && existingEntry) {
      setDate(existingEntry.date.split("T")[0]);
      setOpeningBalance(existingEntry.openingBalance);
      setPaymentGivenToday(existingEntry.paymentGivenToday);
      setBalanceReturnedToday(existingEntry.balanceReturnedToday);
      setWorkerAdvances(existingEntry.workerAdvances || []);
      setCompletedProjects(existingEntry.completedProjects || []);
      setAllocatedProjects(existingEntry.allocatedProjects || []);
    } else if (!isEditing && lastEntry !== void 0) {
      setOpeningBalance(lastEntry ? lastEntry.balanceReturnedToday : 0);
    }
  }, [existingEntry, lastEntry, isEditing]);
  const cost = openingBalance + paymentGivenToday - balanceReturnedToday;
  const formatCurrency = (val) => (val || 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const handleAddAdvance = () => {
    setWorkerAdvances([...workerAdvances, { workerId: "", advanceAmount: 0, targetType: "", targetId: "" }]);
  };
  const handleRemoveAdvance = (index) => {
    const newArr = [...workerAdvances];
    newArr.splice(index, 1);
    setWorkerAdvances(newArr);
  };
  const handleAdvanceChange = (index, field, value) => {
    const newArr = [...workerAdvances];
    newArr[index] = { ...newArr[index], [field]: value };
    if (field === "targetType") {
      newArr[index].targetId = "";
    }
    setWorkerAdvances(newArr);
  };
  const handleAllocateProjectToggle = (target) => {
    const exists = allocatedProjects.find((p) => p.targetId === target.id);
    if (exists) {
      setAllocatedProjects(allocatedProjects.filter((p) => p.targetId !== target.id));
    } else {
      setAllocatedProjects([...allocatedProjects, { targetType: target.targetType, targetId: target.id }]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const adv of workerAdvances) {
      if (!adv.workerId || adv.advanceAmount <= 0) {
        return zt.error("Please fill in all worker advance details correctly.");
      }
    }
    const cleanedWorkerAdvances = workerAdvances.map((adv) => {
      const payloadAdv = {
        workerId: adv.workerId,
        advanceAmount: adv.advanceAmount
      };
      if (adv.targetType) {
        payloadAdv.targetType = adv.targetType;
        if (adv.targetId) payloadAdv.targetId = adv.targetId;
      }
      return payloadAdv;
    });
    const payload = {
      date: new Date(date).toISOString(),
      openingBalance,
      paymentGivenToday,
      balanceReturnedToday,
      workerAdvances: cleanedWorkerAdvances,
      completedProjects,
      allocatedProjects
    };
    try {
      if (isEditing) {
        await updateEntry.mutateAsync({ id, data: payload });
        zt.success("Ledger updated");
      } else {
        await createEntry.mutateAsync(payload);
        zt.success("Ledger entry created");
      }
      navigate("/ledger");
    } catch (err) {
      zt.error(err.message || "Failed to save ledger entry");
    }
  };
  if (isEditing && loadingExisting) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, { rows: 8 }) });
  }
  const getTargetsForType = (type) => {
    return targets?.filter((t) => t.targetType === type) || [];
  };
  const completableTargets = targets?.filter((t) => t.status !== "COMPLETED") || [];
  const allTargetsToShow = completableTargets.slice();
  if (isEditing && existingEntry) {
    existingEntry.completedProjects.forEach((cp) => {
      if (!allTargetsToShow.find((t) => t.id === cp.targetId)) {
        allTargetsToShow.push({
          id: cp.targetId,
          title: cp.targetTitle || cp.targetId,
          targetType: cp.targetType,
          status: "COMPLETED"
        });
      }
    });
    existingEntry.allocatedProjects.forEach((ap) => {
      if (!allTargetsToShow.find((t) => t.id === ap.targetId)) {
        allTargetsToShow.push({
          id: ap.targetId,
          title: ap.targetTitle || ap.targetId,
          targetType: ap.targetType,
          status: "COMPLETED"
        });
      }
    });
  }
  const currencyInputStyle = { position: "relative" };
  const currencyPrefixStyle = {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-muted)",
    fontSize: "0.85rem",
    pointerEvents: "none"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", fontSize: "0.9rem", color: "var(--text-secondary)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "btn btn-ghost btn-sm", onClick: () => navigate("/ledger"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
        " Back"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: isEditing ? "Edit Entry" : "New Entry" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "1.5rem" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: "1.6rem", fontWeight: 700, color: "#fff" }, children: isEditing ? "Edit Ledger Entry" : "Create Daily Ledger Entry" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: "1.5rem", paddingBottom: "5.5rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)" }, children: "Financial Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", className: "form-input", value: date, onChange: (e) => setDate(e.target.value), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "form-label", children: [
              "Opening Balance ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.75rem", fontWeight: 400, color: "var(--text-muted)", marginLeft: "0.4rem" }, children: "(Carried from previous day's return)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: currencyInputStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: currencyPrefixStyle, children: "LKR" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", className: "form-input", style: { paddingLeft: "3.25rem", background: "rgba(0,0,0,0.3)", color: "var(--text-muted)" }, value: openingBalance, readOnly: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Payment Given Today" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: currencyInputStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: currencyPrefixStyle, children: "LKR" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  min: "0",
                  step: "0.01",
                  className: "form-input",
                  style: { paddingLeft: "3.25rem" },
                  value: paymentGivenToday,
                  onChange: (e) => setPaymentGivenToday(parseFloat(e.target.value) || 0),
                  required: true
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Balance Returned Today" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: currencyInputStyle, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: currencyPrefixStyle, children: "LKR" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  min: "0",
                  step: "0.01",
                  className: "form-input",
                  style: { paddingLeft: "3.25rem" },
                  value: balanceReturnedToday,
                  onChange: (e) => setBalanceReturnedToday(parseFloat(e.target.value) || 0),
                  required: true
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              marginTop: "1.5rem",
              padding: "1rem 1.25rem",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.85rem", fontWeight: 600, color: "var(--danger)" }, children: "Derived Cost for the Day" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.75rem", color: "var(--danger)", opacity: 0.75 }, children: "(Opening + Given - Returned)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "1.5rem", fontWeight: 700, color: "var(--danger)" }, children: [
                "LKR ",
                formatCurrency(cost)
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.1rem", fontWeight: 700, color: "#fff" }, children: "Worker Advances" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "btn btn-secondary btn-sm", onClick: handleAddAdvance, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
            " Add Worker"
          ] })
        ] }),
        workerAdvances.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              textAlign: "center",
              padding: "1.5rem",
              color: "var(--text-muted)",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "var(--radius-sm)",
              border: "1px dashed var(--border-bright)",
              fontSize: "0.9rem"
            },
            children: "No worker advances for today."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "0.75rem" }, children: workerAdvances.map((adv, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              alignItems: "flex-end",
              padding: "0.75rem",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: "1 1 180px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { fontSize: "0.75rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.25rem", display: "block" }, children: "Worker" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "form-select", style: { padding: "0.5rem 0.75rem", fontSize: "0.85rem" }, value: adv.workerId, onChange: (e) => handleAdvanceChange(i, "workerId", e.target.value), required: true, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Worker..." }),
                  workers?.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: w.id, children: [
                    w.name,
                    " (",
                    w.workerId,
                    ")"
                  ] }, w.id))
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: "1 1 140px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { fontSize: "0.75rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.25rem", display: "block" }, children: "Amount (LKR)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: "1",
                    step: "0.01",
                    className: "form-input",
                    style: { padding: "0.5rem 0.75rem", fontSize: "0.85rem" },
                    value: adv.advanceAmount || "",
                    onChange: (e) => handleAdvanceChange(i, "advanceAmount", parseFloat(e.target.value) || 0),
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: "1 1 160px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { fontSize: "0.75rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.25rem", display: "block" }, children: "Project Type (Optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "form-select", style: { padding: "0.5rem 0.75rem", fontSize: "0.85rem" }, value: adv.targetType || "", onChange: (e) => handleAdvanceChange(i, "targetType", e.target.value), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "None" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: TargetType.PROJECT, children: "Project" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: TargetType.SUB_PROJECT, children: "Sub Project" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: TargetType.CHILD_PROJECT, children: "Child Project" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: "1 1 180px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { fontSize: "0.75rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.25rem", display: "block" }, children: "Target (Optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    className: "form-select",
                    style: { padding: "0.5rem 0.75rem", fontSize: "0.85rem" },
                    value: adv.targetId || "",
                    onChange: (e) => handleAdvanceChange(i, "targetId", e.target.value),
                    disabled: !adv.targetType,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Target..." }),
                      getTargetsForType(adv.targetType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t.id, children: t.title }, t.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn-ghost btn-sm", style: { color: "var(--danger)" }, onClick: () => handleRemoveAdvance(i), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 18 }) }) })
            ]
          },
          i
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.1rem", fontWeight: 700, color: "#fff" }, children: "Projects Worked On (Cost Allocation)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }, children: [
            "Select the active projects that received work today. The day's cost (LKR ",
            formatCurrency(cost),
            ") will be divided equally and added to their cumulative cost."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
              maxHeight: 240,
              overflowY: "auto",
              padding: "0.5rem",
              background: "rgba(0,0,0,0.1)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)"
            },
            children: allTargetsToShow.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { gridColumn: "1 / -1", textAlign: "center", color: "var(--text-muted)", padding: "1rem" }, children: "No active projects found." }) : allTargetsToShow.map((target) => {
              const checked = !!allocatedProjects.find((p) => p.targetId === target.id);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  style: {
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    background: checked ? "var(--primary-glow)" : "var(--surface)",
                    border: `1px solid ${checked ? "var(--primary)" : "var(--border)"}`,
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        style: { marginTop: "0.15rem", width: 16, height: 16, accentColor: "var(--primary)" },
                        checked,
                        onChange: () => handleAllocateProjectToggle(target)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.9rem", fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.3 }, children: target.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem", textTransform: "uppercase" }, children: target.targetType.replace("_", " ") })
                    ] })
                  ]
                },
                `alloc-${target.id}`
              );
            })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            position: "sticky",
            bottom: "1rem",
            padding: "1rem",
            background: "rgba(17,24,39,0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-bright)",
            zIndex: 10
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn btn-ghost", onClick: () => navigate("/ledger"), children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "btn btn-primary", disabled: createEntry.isPending || updateEntry.isPending, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
              " ",
              createEntry.isPending || updateEntry.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin mr-2 inline" }),
                " Saving..."
              ] }) : isEditing ? "Save Changes" : "Save Ledger Entry"
            ] })
          ]
        }
      )
    ] })
  ] });
}
export {
  LedgerEntryFormPage as default
};
