import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import CompanyHeader from './CompanyHeader.js';
import CompanyFooter from './CompanyFooter.js';
import { theme } from './pdfTheme.js';
const styles = StyleSheet.create({
    page: { padding: 60, fontSize: 10, fontFamily: 'Helvetica', color: '#222' },
    nameDate: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    nameDateLabel: { fontFamily: 'Helvetica-Bold' },
    underline: { textDecoration: 'underline' },
    table: { borderWidth: 1, borderColor: theme.border },
    headerRow: { flexDirection: 'row', backgroundColor: theme.green },
    headerCell: { color: '#fff', fontFamily: 'Helvetica-Bold', padding: 6, fontSize: 10 },
    spacerRow: { flexDirection: 'row', backgroundColor: theme.paleGreen, height: 6 },
    row: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: theme.border },
    cellLabel: { flex: 4, padding: 5, fontSize: 9 },
    cellValue: { flex: 3, padding: 5, fontSize: 9, textAlign: 'right' },
    netPayRow: { flexDirection: 'row', backgroundColor: theme.green, borderTopWidth: 1, borderTopColor: theme.border },
    netPayLabel: { flex: 4, padding: 6, color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 11 },
    netPayValue: { flex: 3, padding: 6, textAlign: 'right', color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 11 },
    noticeBox: { backgroundColor: theme.lightGreen, padding: 12, marginTop: 30 },
    noticeText: { fontSize: 9, textAlign: 'center', fontFamily: 'Helvetica-Oblique' },
});
const fmt = (n) => n.toLocaleString('en-LK', { minimumFractionDigits: 2 });
const PaysheetPDF = ({ salary }) => (_jsx(Document, { children: _jsxs(Page, { size: "A4", style: styles.page, children: [_jsx(CompanyHeader, {}), _jsxs(View, { style: styles.nameDate, children: [_jsxs(Text, { children: [_jsx(Text, { style: styles.nameDateLabel, children: "Worker: " }), _jsxs(Text, { style: styles.underline, children: [salary.worker.name, " (", salary.worker.workerId, ")"] })] }), _jsxs(Text, { children: [_jsx(Text, { style: styles.nameDateLabel, children: "Period: " }), salary.month, "/", salary.year] })] }), _jsxs(View, { style: styles.table, children: [_jsx(View, { style: styles.headerRow, children: _jsx(Text, { style: styles.headerCell, children: "PAYSHEET" }) }), _jsx(View, { style: styles.spacerRow }), _jsxs(View, { style: styles.row, children: [_jsx(Text, { style: styles.cellLabel, children: "Days Worked" }), _jsx(Text, { style: styles.cellValue, children: salary.daysWorked })] }), _jsxs(View, { style: styles.row, children: [_jsx(Text, { style: styles.cellLabel, children: "Rate Type" }), _jsx(Text, { style: styles.cellValue, children: salary.worker.rateType })] }), _jsxs(View, { style: styles.row, children: [_jsx(Text, { style: styles.cellLabel, children: "Base Pay" }), _jsxs(Text, { style: styles.cellValue, children: ["LKR ", fmt(salary.basePay)] })] }), _jsxs(View, { style: styles.row, children: [_jsx(Text, { style: styles.cellLabel, children: "Bonuses" }), _jsxs(Text, { style: styles.cellValue, children: ["LKR ", fmt(salary.bonuses)] })] }), _jsxs(View, { style: styles.row, children: [_jsx(Text, { style: styles.cellLabel, children: "Deductions" }), _jsxs(Text, { style: styles.cellValue, children: ["LKR ", fmt(salary.deductions)] })] }), _jsxs(View, { style: styles.row, children: [_jsx(Text, { style: styles.cellLabel, children: "Daily Paid (via Ledger)" }), _jsxs(Text, { style: styles.cellValue, children: ["LKR ", fmt(salary.dailyPaid ?? 0)] })] }), _jsxs(View, { style: styles.row, children: [_jsx(Text, { style: styles.cellLabel, children: "Advances Given" }), _jsxs(Text, { style: styles.cellValue, children: ["LKR ", fmt(salary.advancesTotal)] })] }), _jsxs(View, { style: styles.netPayRow, children: [_jsx(Text, { style: styles.netPayLabel, children: "NET PAY" }), _jsxs(Text, { style: styles.netPayValue, children: ["LKR ", fmt(salary.netPay)] })] })] }), _jsx(CompanyFooter, {}), _jsx(View, { style: styles.noticeBox, children: _jsx(Text, { style: styles.noticeText, children: "This is a computer-generated paysheet and does not require a signature." }) })] }) }));
export default PaysheetPDF;
//# sourceMappingURL=PaysheetPDF.js.map