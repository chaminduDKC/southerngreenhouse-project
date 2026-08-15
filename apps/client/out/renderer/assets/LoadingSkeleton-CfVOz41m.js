import { j as jsxRuntimeExports } from "./index-BvumJaAs.js";
const LoadingSkeleton = ({ rows = 3, type = "table" }) => {
  if (type === "card") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }, children: Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-skeleton", style: { height: "24px", width: "40%", marginBottom: "1rem" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-skeleton", style: { height: "36px", width: "80%", marginBottom: "0.5rem" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-skeleton", style: { height: "16px", width: "60%" } })
    ] }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: { width: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-skeleton", style: { height: "16px", width: "60%" } }) }, i)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: Array.from({ length: rows }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: Array.from({ length: 5 }).map((_2, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-skeleton", style: { height: "16px", width: "80%" } }) }, j)) }, i)) })
  ] }) });
};
export {
  LoadingSkeleton as L
};
