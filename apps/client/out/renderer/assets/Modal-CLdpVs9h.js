import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports } from "./index-BvumJaAs.js";
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const X = createLucideIcon("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
const Modal = ({ isOpen, onClose, title, children, footer, size = "md" }) => {
  reactExports.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `modal modal-${size}`, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "modal-close", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-body", children }),
    footer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-footer", children: footer })
  ] }) });
};
export {
  Modal as M
};
