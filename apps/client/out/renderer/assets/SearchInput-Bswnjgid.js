import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports } from "./index-BvumJaAs.js";
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Search = createLucideIcon("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
const SearchInput = ({ value, onChange, placeholder = "Search...", delay = 300 }) => {
  const [localVal, setLocalVal] = reactExports.useState(value);
  reactExports.useEffect(() => {
    setLocalVal(value);
  }, [value]);
  reactExports.useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localVal);
    }, delay);
    return () => clearTimeout(handler);
  }, [localVal, delay, onChange]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-input-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "search-icon", size: 18 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "text",
        className: "form-input search-input",
        placeholder,
        value: localVal,
        onChange: (e) => setLocalVal(e.target.value)
      }
    )
  ] });
};
export {
  SearchInput as S
};
