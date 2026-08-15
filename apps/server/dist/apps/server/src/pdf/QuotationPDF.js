import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
    header: { fontSize: 24, marginBottom: 20, color: '#2e7d32', fontWeight: 'bold' },
    section: { margin: 10, padding: 10 },
    row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5, paddingTop: 5 },
    colDesc: { flex: 4 },
    colQty: { flex: 1, textAlign: 'right' },
    colPrice: { flex: 2, textAlign: 'right' },
    colTotal: { flex: 2, textAlign: 'right' },
    bold: { fontWeight: 'bold' },
    summaryRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
    summaryLabel: { width: 100, textAlign: 'right', paddingRight: 10 },
    summaryValue: { width: 100, textAlign: 'right', fontWeight: 'bold' }
});
const QuotationPDF = ({ quotation }) => (_jsx(Document, { children: _jsxs(Page, { size: "A4", style: styles.page, children: [_jsx(Text, { style: styles.header, children: "Southern Greenhouse - Quotation" }), _jsxs(View, { style: styles.section, children: [_jsxs(Text, { children: ["Quotation #", quotation.id.slice(-6).toUpperCase()] }), _jsxs(Text, { children: ["Date: ", new Date(quotation.createdAt).toLocaleDateString()] }), _jsxs(Text, { children: ["Valid Until: ", new Date(quotation.validUntil).toLocaleDateString()] })] }), _jsxs(View, { style: styles.section, children: [_jsxs(Text, { style: styles.bold, children: ["To: ", quotation.client?.name] }), _jsx(Text, { children: quotation.client?.address }), quotation.project && _jsxs(Text, { children: ["Project: ", quotation.project.title] })] }), _jsxs(View, { style: styles.section, children: [_jsxs(View, { style: [styles.row, styles.bold, { backgroundColor: '#f1f8e9' }], children: [_jsx(Text, { style: styles.colDesc, children: "Description" }), _jsx(Text, { style: styles.colQty, children: "Qty" }), _jsx(Text, { style: styles.colPrice, children: "Unit Price" }), _jsx(Text, { style: styles.colTotal, children: "Total" })] }), quotation.items.map((item, i) => (_jsxs(View, { style: styles.row, children: [_jsx(Text, { style: styles.colDesc, children: item.description }), _jsx(Text, { style: styles.colQty, children: item.qty }), _jsx(Text, { style: styles.colPrice, children: item.unitPrice.toFixed(2) }), _jsx(Text, { style: styles.colTotal, children: item.lineTotal.toFixed(2) })] }, i))), _jsxs(View, { style: styles.summaryRow, children: [_jsx(Text, { style: styles.summaryLabel, children: "Subtotal:" }), _jsx(Text, { style: styles.summaryValue, children: (quotation.total - quotation.transportCost).toFixed(2) })] }), _jsxs(View, { style: styles.summaryRow, children: [_jsx(Text, { style: styles.summaryLabel, children: "Transport:" }), _jsx(Text, { style: styles.summaryValue, children: quotation.transportCost.toFixed(2) })] }), _jsxs(View, { style: styles.summaryRow, children: [_jsx(Text, { style: [styles.summaryLabel, styles.bold], children: "Grand Total:" }), _jsx(Text, { style: styles.summaryValue, children: quotation.total.toFixed(2) })] })] }), quotation.notes && (_jsxs(View, { style: styles.section, children: [_jsx(Text, { style: styles.bold, children: "Notes:" }), _jsx(Text, { children: quotation.notes })] }))] }) }));
export default QuotationPDF;
//# sourceMappingURL=QuotationPDF.js.map