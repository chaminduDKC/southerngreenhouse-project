import { j as jsxRuntimeExports, R as React } from "./index-BvumJaAs.js";
const EmptyState = ({ icon, title, message }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state glass-card", children: [
    React.cloneElement(icon, { size: 64 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: title }),
    message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: message })
  ] });
};
export {
  EmptyState as E
};
