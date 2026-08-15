import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { COMPANY } from './companyInfo.js';
import { theme } from './pdfTheme.js';
const styles = StyleSheet.create({
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    logo: { width: 70, height: 70, marginRight: 15 },
    headerText: { flex: 1 },
    companyName: { fontSize: 26, fontFamily: 'Helvetica-Bold', color: theme.green },
    taglineRow: { flexDirection: 'row', marginTop: 4 },
    taglineCol: { flexDirection: 'column', marginRight: 40 },
    taglineItem: { fontSize: 9, color: theme.green, fontFamily: 'Helvetica-Bold' },
});
const CompanyHeader = () => (_jsxs(View, { style: styles.headerRow, children: [_jsx(Image, { src: COMPANY.logoUrl, style: styles.logo }), _jsxs(View, { style: styles.headerText, children: [_jsx(Text, { style: styles.companyName, children: COMPANY.name }), _jsxs(View, { style: styles.taglineRow, children: [_jsx(View, { style: styles.taglineCol, children: COMPANY.tagline.map((pair, i) => (_jsx(Text, { style: styles.taglineItem, children: pair[0] ? `•  ${pair[0]}` : '' }, i))) }), _jsx(View, { style: styles.taglineCol, children: COMPANY.tagline.map((pair, i) => (_jsx(Text, { style: styles.taglineItem, children: pair[1] ? `•  ${pair[1]}` : '' }, i))) })] })] })] }));
export default CompanyHeader;
//# sourceMappingURL=CompanyHeader.js.map