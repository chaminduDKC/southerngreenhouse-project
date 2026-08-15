import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
    header: { fontSize: 24, marginBottom: 20, color: '#1565c0', fontWeight: 'bold' },
    section: { margin: 10, padding: 10 },
    bold: { fontWeight: 'bold' },
    summaryRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
    summaryLabel: { width: 120, textAlign: 'right', paddingRight: 10 },
    summaryValue: { width: 100, textAlign: 'right' }
});
const InvoicePDF = ({ invoice }) => (_jsx(Document, { children: _jsxs(Page, { size: "A4", style: styles.page, children: [_jsx(Text, { style: styles.header, children: "INVOICE" }), _jsxs(View, { style: styles.section, children: [_jsxs(Text, { children: ["Invoice #", invoice.id.slice(-6).toUpperCase()] }), _jsxs(Text, { children: ["Date: ", new Date(invoice.createdAt).toLocaleDateString()] }), _jsxs(Text, { children: ["Due Date: ", new Date(invoice.dueDate).toLocaleDateString()] })] }), _jsxs(View, { style: styles.section, children: [_jsxs(Text, { style: styles.bold, children: ["Bill To: ", invoice.client?.name] }), _jsx(Text, { children: invoice.client?.address }), _jsxs(Text, { children: ["Project: ", invoice.project?.title] })] }), _jsxs(View, { style: styles.section, children: [_jsxs(View, { style: styles.summaryRow, children: [_jsx(Text, { style: styles.summaryLabel, children: "Total Amount:" }), _jsx(Text, { style: styles.summaryValue, children: invoice.totalAmount.toFixed(2) })] }), _jsxs(View, { style: styles.summaryRow, children: [_jsx(Text, { style: [styles.summaryLabel, styles.bold], children: "Amount Due:" }), _jsx(Text, { style: [styles.summaryValue, styles.bold], children: invoice.amountDue.toFixed(2) })] })] }), invoice.notes && (_jsxs(View, { style: styles.section, children: [_jsx(Text, { style: styles.bold, children: "Notes:" }), _jsx(Text, { children: invoice.notes })] }))] }) }));
export default InvoicePDF;
//# sourceMappingURL=InvoicePDF.js.map