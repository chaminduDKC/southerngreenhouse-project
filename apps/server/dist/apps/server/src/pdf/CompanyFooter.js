import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, Link, StyleSheet } from '@react-pdf/renderer';
import { COMPANY } from './companyInfo.js';
import { theme } from './pdfTheme.js';
const styles = StyleSheet.create({
    footerRow: { flexDirection: 'row', marginTop: 25, fontSize: 9 },
    col: { flex: 1 },
    red: { color: theme.red, marginBottom: 2 },
    blue: { color: theme.blue, textDecoration: 'underline', marginBottom: 2 },
    label: { fontFamily: 'Helvetica-Bold', marginBottom: 3 },
});
const CompanyFooter = () => (_jsxs(View, { style: styles.footerRow, children: [_jsxs(View, { style: styles.col, children: [_jsx(Text, { style: [styles.red, styles.label], children: "Tel :" }), COMPANY.phones.map((p, i) => (_jsx(Text, { style: styles.red, children: p }, i)))] }), _jsxs(View, { style: styles.col, children: [_jsx(Text, { style: [styles.red, styles.label], children: "Address" }), COMPANY.address.map((line, i) => (_jsx(Text, { style: styles.red, children: line }, i)))] }), _jsxs(View, { style: styles.col, children: [_jsx(Text, { style: styles.label, children: "Like us On:" }), _jsx(Link, { src: COMPANY.facebook.url, style: styles.blue, children: COMPANY.facebook.label }), _jsx(Link, { src: `mailto:${COMPANY.email}`, style: styles.blue, children: COMPANY.email })] })] }));
export default CompanyFooter;
//# sourceMappingURL=CompanyFooter.js.map