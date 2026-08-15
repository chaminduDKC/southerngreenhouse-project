import { c as createLucideIcon, u as useNavigate, r as reactExports, j as jsxRuntimeExports, z as zt } from "./index-BvumJaAs.js";
import { P as PageHeader } from "./PageHeader-F5xlwJlO.js";
import { E as EmptyState } from "./EmptyState-wZU2_9Zt.js";
import { e as useInventory, i as useEligibleAllocationTargets, j as useAllocateInventory } from "./index-D6YZuVUF.js";
import { A as ArrowLeft } from "./arrow-left-Z22Cy2p_.js";
import "./index-MsCQlR0B.js";
import "./useMutation-GA9qKVkW.js";
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PackageSearch = createLucideIcon("PackageSearch", [
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }],
  ["circle", { cx: "18.5", cy: "15.5", r: "2.5", key: "b5zd12" }],
  ["path", { d: "M20.27 17.27 22 19", key: "1l4muz" }]
]);
function AllocationPage() {
  const navigate = useNavigate();
  const { data: inventoryItems, isLoading: itemsLoading } = useInventory();
  const { data: targets, isLoading: targetsLoading } = useEligibleAllocationTargets();
  const allocateInventory = useAllocateInventory();
  const [selectedItemId, setSelectedItemId] = reactExports.useState("");
  const [quantities, setQuantities] = reactExports.useState({});
  const selectedItem = reactExports.useMemo(() => inventoryItems?.find((i) => i.id === selectedItemId), [inventoryItems, selectedItemId]);
  const activeTargets = reactExports.useMemo(() => targets?.filter((t) => t.status !== "COMPLETED" && t.status !== "ON_HOLD") || [], [targets]);
  const totalAllocated = reactExports.useMemo(() => Object.values(quantities).reduce((a, b) => a + (b || 0), 0), [quantities]);
  const handleQuantityChange = (targetId, value) => {
    setQuantities((prev) => ({ ...prev, [targetId]: value }));
  };
  const handleSubmit = async () => {
    if (!selectedItemId) return zt.error("Select an item");
    if (totalAllocated === 0) return zt.error("Allocate at least 1 quantity");
    if (selectedItem && totalAllocated > selectedItem.quantity) return zt.error("Total allocated exceeds available stock");
    const rows = Object.entries(quantities).filter(([_, qty]) => qty > 0).map(([targetId, qty]) => {
      const target = activeTargets.find((t) => t.id === targetId);
      return {
        targetType: target.targetType,
        targetId: target.id,
        quantity: qty
      };
    });
    try {
      await allocateInventory.mutateAsync({
        inventoryItemId: selectedItemId,
        rows
      });
      zt.success("Allocated successfully");
      navigate("/inventory");
    } catch (err) {
      zt.error(err.message || "Failed to allocate");
    }
  };
  const overAllocated = selectedItem ? totalAllocated > selectedItem.quantity : false;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Allocate Inventory",
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-secondary", onClick: () => navigate("/inventory"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
          " Back to Inventory"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", style: { marginBottom: "1.5rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#fff" }, children: "Step 1: Select Inventory Item" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxWidth: 420 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          className: "form-select",
          value: selectedItemId,
          onChange: (e) => {
            setSelectedItemId(e.target.value);
            setQuantities({});
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "-- Choose Item --" }),
            inventoryItems?.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: item.id, disabled: item.quantity <= 0, children: [
              item.name,
              " (",
              item.quantity,
              " ",
              item.unit,
              " available)"
            ] }, item.id))
          ]
        }
      ) }),
      selectedItem && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            marginTop: "1rem",
            padding: "1rem 1.25rem",
            background: "var(--primary-glow)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "var(--text-secondary)" }, children: "Selected Item" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, fontSize: "1.1rem", color: "var(--primary)" }, children: selectedItem.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "right" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "0.8rem", color: "var(--text-secondary)" }, children: "Available Stock" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: 700, fontSize: "1.3rem", color: "var(--text-primary)" }, children: [
                selectedItem.quantity,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.85rem", fontWeight: 400, color: "var(--text-secondary)" }, children: selectedItem.unit })
              ] })
            ] })
          ]
        }
      )
    ] }),
    selectedItem && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", style: { padding: 0, overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "1.1rem", fontWeight: 700, color: "#fff" }, children: "Step 2: Allocate to Projects" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.9rem", fontWeight: 500, color: "var(--text-secondary)" }, children: [
              "Total to Allocate:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.1rem", fontWeight: 700, color: overAllocated ? "var(--danger)" : "var(--accent)" }, children: totalAllocated }),
              " ",
              "/ ",
              selectedItem.quantity
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", style: { border: "none", borderRadius: 0, maxHeight: 500, overflow: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { style: { position: "sticky", top: 0, background: "var(--surface)", zIndex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Target Project" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { textAlign: "right" }, children: "Qty to Allocate" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: targetsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, style: { textAlign: "center", padding: "2rem" }, children: "Loading targets..." }) }) : activeTargets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, style: { padding: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PackageSearch, {}), title: "No active projects found", message: "There are no eligible projects to allocate this item to right now." }) }) }) : activeTargets.map((target) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { fontWeight: 500, color: "var(--text-primary)" }, children: target.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chip", children: target.targetType.replace("_", " ") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: target.location }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${target.status === "ACTIVE" ? "badge-active" : "badge-in-progress"}`, children: target.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.5rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                min: "0",
                step: "0.01",
                max: selectedItem.quantity,
                className: "form-input",
                style: { width: 100, textAlign: "right", padding: "0.5rem 0.75rem" },
                value: quantities[target.id] || "",
                onChange: (e) => handleQuantityChange(target.id, parseFloat(e.target.value) || 0),
                placeholder: "0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.85rem", color: "var(--text-secondary)", width: 32, textAlign: "left" }, children: selectedItem.unit })
          ] }) })
        ] }, target.id)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            padding: "1.25rem 1.5rem",
            background: "rgba(0,0,0,0.1)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn btn-primary",
              style: { paddingLeft: "2rem", paddingRight: "2rem" },
              disabled: totalAllocated <= 0 || overAllocated,
              onClick: handleSubmit,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 18 }),
                " Allocate Inventory"
              ]
            }
          )
        }
      )
    ] })
  ] });
}
export {
  AllocationPage as default
};
