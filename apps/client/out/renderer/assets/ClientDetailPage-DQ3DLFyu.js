import { c as createLucideIcon, b as useParams, u as useNavigate, r as reactExports, j as jsxRuntimeExports, F as FileText } from "./index-BvumJaAs.js";
import { u as useQuery, g as getClient } from "./index-MsCQlR0B.js";
import { A as ArrowLeft } from "./arrow-left-Z22Cy2p_.js";
import { B as Briefcase } from "./briefcase-zD2K74yx.js";
import { D as Download } from "./download-C4B-gW11.js";
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FilePenLine = createLucideIcon("FilePenLine", [
  [
    "path",
    {
      d: "m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2",
      key: "142zxg"
    }
  ],
  [
    "path",
    {
      d: "M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
      key: "2t3380"
    }
  ],
  ["path", { d: "M8 18h1", key: "13wk12" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquarePen = createLucideIcon("SquarePen", [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
]);
function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = reactExports.useState("projects");
  const { data: client, isLoading, isError } = useQuery({
    queryKey: ["client", id],
    queryFn: () => getClient(id)
  });
  const downloadPDF = async (type, docId) => {
    const token = localStorage.getItem("sg_token") || "";
    const res = await fetch(`http://localhost:3001/api/${type}/${docId}/pdf`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type.slice(0, -1)}-${docId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-skeleton", children: "Loading..." });
  if (isError || !client) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state", children: "Error loading client" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-header flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate("/clients"), className: "btn-ghost", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Client Details" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate(`/clients/${id}/edit`), className: "btn-secondary btn-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4 mr-2" }),
        " Edit Client"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-2", children: client.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-500 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Phone:" }),
        " ",
        client.phone
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-gray-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Address:" }),
        " ",
        client.address
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tabs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `tab ${activeTab === "projects" ? "active" : ""}`,
          onClick: () => setActiveTab("projects"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-4 h-4 inline mr-2" }),
            " Projects"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `tab ${activeTab === "quotations" ? "active" : ""}`,
          onClick: () => setActiveTab("quotations"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FilePenLine, { className: "w-4 h-4 inline mr-2" }),
            " Quotations"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `tab ${activeTab === "invoices" ? "active" : ""}`,
          onClick: () => setActiveTab("invoices"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 inline mr-2" }),
            " Invoices"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-0", children: [
      activeTab === "projects" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Value" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Cost" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          client.projects?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: p.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: p.location }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${p.status.toLowerCase()}`, children: p.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: p.value?.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: p.cost?.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate(`/projects/${p.id}`), className: "btn-ghost btn-sm", children: "View" }) })
          ] }, p.id)),
          !client.projects?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "text-center py-4", children: "No projects found" }) })
        ] })
      ] }) }),
      activeTab === "quotations" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Project" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Valid Until" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          client.quotations?.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: q.id.slice(0, 8) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: q.project?.title || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: new Date(q.validUntil).toLocaleDateString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: q.total?.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `badge ${q.status.toLowerCase()}`, children: q.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => downloadPDF("quotations", q.id), className: "btn-ghost btn-sm", title: "Download PDF", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }) }) })
          ] }, q.id)),
          !client.quotations?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "text-center py-4", children: "No quotations found" }) })
        ] })
      ] }) }),
      activeTab === "invoices" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-container", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Project" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Total Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Amount Due" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Due Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          client.invoices?.map((i) => {
            const isOverdue = new Date(i.dueDate) < /* @__PURE__ */ new Date() && i.amountDue > 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: isOverdue ? "overdue-row" : "", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: i.id.slice(0, 8) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: i.project?.title || "-" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: i.totalAmount?.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
                i.amountDue?.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                isOverdue && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge danger ml-2", children: "Overdue" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: new Date(i.dueDate).toLocaleDateString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => downloadPDF("invoices", i.id), className: "btn-ghost btn-sm", title: "Download PDF", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }) }) })
            ] }, i.id);
          }),
          !client.invoices?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "text-center py-4", children: "No invoices found" }) })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  ClientDetailPage as default
};
