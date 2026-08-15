import { j as jsxRuntimeExports } from "./index-BvumJaAs.js";
const PageHeader = ({ title, subtitle, action }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-header", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "page-title", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }, children: subtitle })
    ] }),
    action && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-header-actions", children: action })
  ] });
};
export {
  PageHeader as P
};
