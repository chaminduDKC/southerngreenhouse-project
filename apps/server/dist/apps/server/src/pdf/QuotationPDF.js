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
    cell: { padding: 5, fontSize: 9 },
    colNo: { width: 30 },
    colDesc: { flex: 4 },
    colQty: { width: 55, textAlign: 'center' },
    colPrice: { width: 70, textAlign: 'right' },
    colTotal: { width: 75, textAlign: 'right' },
    transportRow: { flexDirection: 'row', backgroundColor: theme.lightGreen, borderTopWidth: 1, borderTopColor: theme.border },
    transportLabel: { flex: 5, padding: 5, fontFamily: 'Helvetica-Bold', fontSize: 9 },
    transportValue: { width: 75, padding: 5, textAlign: 'right', fontSize: 9 },
    totalRow: { flexDirection: 'row', backgroundColor: theme.green, borderTopWidth: 1, borderTopColor: theme.border },
    totalLabel: { flex: 5, padding: 6, color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 11 },
    totalValue: { width: 75, padding: 6, textAlign: 'right', color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 11 },
    noticeBox: { backgroundColor: theme.lightGreen, padding: 12, marginTop: 30 },
    noticeText: { fontSize: 9, textAlign: 'center', fontFamily: 'Helvetica-Oblique', marginBottom: 3 },
    noticeBold: { fontSize: 9, textAlign: 'center', fontFamily: 'Helvetica-Bold', textDecoration: 'underline' },
});
const fmt = (n) => n.toLocaleString('en-LK', { minimumFractionDigits: 0 });
const QuotationPDF = ({ quotation }) => {
    const subtotal = quotation.total - (quotation.transportCost || 0);
    return (_jsx(Document, { children: _jsxs(Page, { size: "A4", style: styles.page, children: [_jsx(CompanyHeader, {}), _jsxs(View, { style: styles.nameDate, children: [_jsxs(Text, { children: [_jsx(Text, { style: styles.nameDateLabel, children: "Name: " }), _jsx(Text, { style: styles.underline, children: quotation.client?.name })] }), _jsxs(Text, { children: [_jsx(Text, { style: styles.nameDateLabel, children: "Date: " }), new Date(quotation.createdAt).toLocaleDateString('en-CA').replace(/-/g, '. ')] })] }), _jsxs(View, { style: styles.table, children: [_jsxs(View, { style: styles.headerRow, children: [_jsx(Text, { style: [styles.headerCell, styles.colNo], children: "No" }), _jsx(Text, { style: [styles.headerCell, styles.colDesc], children: "Description" }), _jsx(Text, { style: [styles.headerCell, styles.colQty], children: "Quantity" }), _jsx(Text, { style: [styles.headerCell, styles.colPrice], children: "Unit Price" }), _jsx(Text, { style: [styles.headerCell, styles.colTotal], children: "Total" })] }), _jsx(View, { style: styles.spacerRow }), quotation.items.map((item, i) => (_jsxs(View, { style: styles.row, children: [_jsx(Text, { style: [styles.cell, styles.colNo], children: String(i + 1).padStart(2, '0') }), _jsx(Text, { style: [styles.cell, styles.colDesc], children: item.description }), _jsx(Text, { style: [styles.cell, styles.colQty], children: item.qty }), _jsx(Text, { style: [styles.cell, styles.colPrice], children: fmt(item.unitPrice) }), _jsx(Text, { style: [styles.cell, styles.colTotal], children: fmt(item.lineTotal) })] }, i))), _jsxs(View, { style: styles.transportRow, children: [_jsx(Text, { style: styles.transportLabel, children: "Transport and installation" }), _jsx(Text, { style: styles.transportValue, children: fmt(quotation.transportCost || 0) })] }), _jsxs(View, { style: styles.totalRow, children: [_jsx(Text, { style: styles.totalLabel, children: "Total" }), _jsx(Text, { style: styles.totalValue, children: fmt(quotation.total) })] })] }), _jsx(CompanyFooter, {}), _jsxs(View, { style: styles.noticeBox, children: [_jsx(Text, { style: styles.noticeText, children: "Thank you for considering our services. We look forward to build something great together!" }), _jsx(Text, { style: styles.noticeText, children: "To accept this quotation, please reply with your confirmation." }), _jsx(Text, { style: styles.noticeBold, children: "This quotation is valid for 14 days from the date of issue" })] })] }) }));
};
export default QuotationPDF;
//# sourceMappingURL=QuotationPDF.js.map