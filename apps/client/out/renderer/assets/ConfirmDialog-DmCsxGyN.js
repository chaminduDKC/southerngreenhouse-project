import { j as jsxRuntimeExports } from "./index-BvumJaAs.js";
import { M as Modal } from "./Modal-CLdpVs9h.js";
import { L as LoaderCircle } from "./loader-circle-BgPef-d6.js";
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isPending = false
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      isOpen,
      onClose,
      title,
      size: "sm",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost", onClick: onClose, disabled: isPending, children: cancelText }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-danger", onClick: () => {
          onConfirm();
        }, disabled: isPending, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }),
          " ",
          confirmText,
          "ing..."
        ] }) : confirmText })
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--text-secondary)" }, children: message })
    }
  );
};
export {
  ConfirmDialog as C
};
