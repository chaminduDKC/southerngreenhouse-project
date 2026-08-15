import { b as useParams, u as useNavigate, d as useQueryClient, r as reactExports, j as jsxRuntimeExports, z as zt } from "./index-BvumJaAs.js";
import { u as useQuery, U as getInvoice, V as updateInvoice, W as createInvoice, z as getClients, C as getProjects, O as getQuotations } from "./index-MsCQlR0B.js";
import { u as useMutation } from "./useMutation-GA9qKVkW.js";
import { A as ArrowLeft } from "./arrow-left-Z22Cy2p_.js";
import { S as Save } from "./save-BFlD0_Q1.js";
function InvoiceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const [formData, setFormData] = reactExports.useState({
    clientId: "",
    projectId: "",
    quotationId: "",
    totalAmount: 0,
    amountDue: 0,
    dueDate: "",
    notes: ""
  });
  const { data: clients } = useQuery({ queryKey: ["clients"], queryFn: () => getClients() });
  const { data: allProjects } = useQuery({ queryKey: ["projects"], queryFn: getProjects });
  const { data: allQuotations } = useQuery({ queryKey: ["quotations"], queryFn: getQuotations });
  reactExports.useEffect(() => {
    if (isEdit) {
      getInvoice(id).then((i) => {
        setFormData({
          clientId: i.clientId,
          projectId: i.projectId,
          quotationId: i.quotationId || "",
          totalAmount: i.totalAmount,
          amountDue: i.amountDue,
          dueDate: i.dueDate.split("T")[0],
          notes: i.notes || ""
        });
      });
    } else {
      setFormData((prev) => ({ ...prev, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0] }));
    }
  }, [id, isEdit]);
  const mutation = useMutation({
    mutationFn: (data) => isEdit ? updateInvoice(id, data) : createInvoice(data),
    onSuccess: () => {
      zt.success(`Invoice ${isEdit ? "updated" : "created"}`);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      navigate("/invoices");
    },
    onError: () => zt.error("An error occurred")
  });
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.clientId || !formData.projectId || !formData.dueDate) {
      return zt.error("Please fill required fields");
    }
    mutation.mutate(formData);
  };
  const getProjectOptions = () => {
    const options = [];
    allProjects?.forEach((p) => {
      options.push(/* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: p.id, children: [
        "Project: ",
        p.title
      ] }, p.id));
      p.subProjects?.forEach((sp) => {
        options.push(/* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: sp.id, children: [
          "-- Sub: ",
          sp.title
        ] }, sp.id));
        sp.children?.forEach((cp) => {
          options.push(/* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: cp.id, children: [
            "---- Child: ",
            cp.title
          ] }, cp.id));
        });
      });
    });
    return options;
  };
  const filteredQuotations = allQuotations?.filter((q) => q.clientId === formData.clientId) || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: 800, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "1rem" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate("/invoices"), className: "btn btn-ghost btn-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "page-title", children: isEdit ? "Edit Invoice" : "New Invoice" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "glass-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Client *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "form-select",
              required: true,
              value: formData.clientId,
              onChange: (e) => setFormData({ ...formData, clientId: e.target.value }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Client" }),
                clients?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Project *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "form-select",
              required: true,
              value: formData.projectId,
              onChange: (e) => setFormData({ ...formData, projectId: e.target.value }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Project/Sub/Child" }),
                getProjectOptions()
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Quotation (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "form-select",
              value: formData.quotationId,
              onChange: (e) => {
                const qId = e.target.value;
                const quote = allQuotations?.find((q) => q.id === qId);
                if (quote && !isEdit) {
                  setFormData({ ...formData, quotationId: qId, totalAmount: quote.total, amountDue: quote.total });
                } else {
                  setFormData({ ...formData, quotationId: qId });
                }
              },
              disabled: !formData.clientId,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Quotation" }),
                filteredQuotations.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: q.id, children: [
                  q.id.slice(0, 8),
                  " - ",
                  q.total?.toLocaleString("en-LK")
                ] }, q.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Due Date *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              required: true,
              className: "form-input",
              value: formData.dueDate,
              onChange: (e) => setFormData({ ...formData, dueDate: e.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Total Amount *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              step: "0.01",
              required: true,
              className: "form-input",
              value: formData.totalAmount,
              onChange: (e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Amount Due *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              step: "0.01",
              required: true,
              className: "form-input",
              value: formData.amountDue,
              onChange: (e) => setFormData({ ...formData, amountDue: Number(e.target.value) })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            className: "form-textarea",
            value: formData.notes,
            onChange: (e) => setFormData({ ...formData, notes: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "flex-end", paddingTop: "1rem", borderTop: "1px solid var(--border)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "btn btn-primary", disabled: mutation.isPending, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
        " ",
        mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { size: 16, className: "animate-spin mr-2 inline" }),
          " Saving..."
        ] }) : "Save Invoice"
      ] }) })
    ] })
  ] });
}
export {
  InvoiceFormPage as default
};
