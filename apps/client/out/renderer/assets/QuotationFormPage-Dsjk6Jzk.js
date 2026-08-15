import { b as useParams, u as useNavigate, d as useQueryClient, r as reactExports, j as jsxRuntimeExports, z as zt } from "./index-BvumJaAs.js";
import { u as useQuery, P as getQuotation, Q as updateQuotation, R as createQuotation, z as getClients, C as getProjects, A as getInventory } from "./index-MsCQlR0B.js";
import { u as useMutation } from "./useMutation-GA9qKVkW.js";
import { A as ArrowLeft } from "./arrow-left-Z22Cy2p_.js";
import { S as Save } from "./save-BFlD0_Q1.js";
import { T as Trash2 } from "./trash-2-BdJQzDNY.js";
import { P as Plus } from "./plus-BjNY8XxN.js";
function QuotationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const [formData, setFormData] = reactExports.useState({
    clientId: "",
    projectId: "",
    validUntil: "",
    status: "DRAFT",
    transportCost: 0,
    notes: ""
  });
  const [items, setItems] = reactExports.useState([{ id: Date.now(), inventoryItemId: "", description: "", qty: 1, unitPrice: 0 }]);
  const { data: clients } = useQuery({ queryKey: ["clients"], queryFn: () => getClients() });
  const { data: projects } = useQuery({ queryKey: ["projects"], queryFn: getProjects });
  const { data: inventory } = useQuery({ queryKey: ["inventory"], queryFn: () => getInventory() });
  reactExports.useEffect(() => {
    if (isEdit) {
      getQuotation(id).then((q) => {
        setFormData({
          clientId: q.clientId,
          projectId: q.projectId || "",
          validUntil: q.validUntil.split("T")[0],
          status: q.status,
          transportCost: q.transportCost || 0,
          notes: q.notes || ""
        });
        if (q.items?.length) {
          setItems(q.items.map((i) => ({ ...i, id: i.id || Date.now() + Math.random() })));
        }
      });
    } else {
      setFormData((prev) => ({ ...prev, validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0] }));
    }
  }, [id, isEdit]);
  const mutation = useMutation({
    mutationFn: (data) => isEdit ? updateQuotation(id, data) : createQuotation(data),
    onSuccess: () => {
      zt.success(`Quotation ${isEdit ? "updated" : "created"}`);
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      navigate("/quotations");
    },
    onError: () => zt.error("An error occurred")
  });
  const addItem = () => setItems([...items, { id: Date.now(), inventoryItemId: "", description: "", qty: 1, unitPrice: 0 }]);
  const removeItem = (id2) => {
    if (items.length > 1) setItems(items.filter((i) => i.id !== id2));
  };
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === "inventoryItemId" && value) {
      const invItem = inventory?.find((i) => i.id === value);
      if (invItem) {
        newItems[index].unitPrice = invItem.soldPrice || 0;
        if (!newItems[index].description) newItems[index].description = invItem.name;
      }
    }
    setItems(newItems);
  };
  const handleSave = () => {
    if (!formData.clientId) return zt.error("Client is required");
    if (!formData.validUntil) return zt.error("Valid Until date is required");
    const payload = {
      ...formData,
      items: items.map((i) => ({
        inventoryItemId: i.inventoryItemId || void 0,
        description: i.description,
        qty: Number(i.qty),
        unitPrice: Number(i.unitPrice)
      }))
    };
    mutation.mutate(payload);
  };
  const subTotal = items.reduce((sum, item) => sum + Number(item.qty) * Number(item.unitPrice), 0);
  const grandTotal = subTotal + Number(formData.transportCost);
  const filteredProjects = projects?.filter((p) => p.clientId === formData.clientId) || projects;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { maxWidth: 1e3, margin: "0 auto" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "1rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate("/quotations"), className: "btn btn-ghost btn-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 18 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "page-title", children: isEdit ? "Edit Quotation" : "New Quotation" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSave, className: "btn btn-primary", disabled: mutation.isPending, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
        " ",
        mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Loader2, { size: 16, className: "animate-spin mr-2 inline" }),
          " Saving..."
        ] }) : "Save"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Client" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "form-select",
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Project (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "form-select",
              value: formData.projectId,
              onChange: (e) => setFormData({ ...formData, projectId: e.target.value }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Project" }),
                filteredProjects?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.title }, p.id))
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Valid Until" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "date",
              className: "form-input",
              value: formData.validUntil,
              onChange: (e) => setFormData({ ...formData, validUntil: e.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "form-label", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "form-select",
              value: formData.status,
              onChange: (e) => setFormData({ ...formData, status: e.target.value }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "DRAFT", children: "Draft" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SENT", children: "Sent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ACCEPTED", children: "Accepted" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "REJECTED", children: "Rejected" })
              ]
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divider" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }, children: "Line Items" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-container", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Inventory Item" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { width: 90 }, children: "Qty" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { width: 140 }, children: "Unit Price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { width: 140 }, children: "Line Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: { width: 60 } })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: items.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "form-input",
                  value: item.description,
                  onChange: (e) => updateItem(index, "description", e.target.value),
                  placeholder: "Description"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  className: "form-select",
                  value: item.inventoryItemId || "",
                  onChange: (e) => updateItem(index, "inventoryItemId", e.target.value),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Manual Entry" }),
                    inventory?.map((inv) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: inv.id, children: inv.name }, inv.id))
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  min: "1",
                  className: "form-input",
                  style: { textAlign: "right" },
                  value: item.qty,
                  onChange: (e) => updateItem(index, "qty", e.target.value)
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  step: "0.01",
                  className: "form-input",
                  style: { textAlign: "right" },
                  value: item.unitPrice,
                  onChange: (e) => updateItem(index, "unitPrice", e.target.value)
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "right", fontWeight: 500, color: "var(--text-primary)" }, children: (Number(item.qty) * Number(item.unitPrice)).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => removeItem(item.id),
                  className: "btn btn-ghost btn-sm",
                  style: { color: "var(--danger)" },
                  disabled: items.length === 1,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 })
                }
              ) })
            ] }, item.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "0.75rem 1rem", borderTop: "1px solid var(--border)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: addItem, className: "btn btn-secondary btn-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
            " Add Row"
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "flex-end", paddingTop: "1.5rem", marginTop: "1.5rem", borderTop: "1px solid var(--border)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 320, display: "flex", flexDirection: "column", gap: "0.75rem" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: subTotal.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-secondary)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Transport Cost:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              className: "form-input",
              style: { width: 130, textAlign: "right", padding: "0.4rem 0.75rem" },
              value: formData.transportCost,
              onChange: (e) => setFormData({ ...formData, transportCost: Number(e.target.value) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 700,
          fontSize: "1.1rem",
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--border)",
          color: "var(--text-primary)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Grand Total:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: grandTotal.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  QuotationFormPage as default
};
