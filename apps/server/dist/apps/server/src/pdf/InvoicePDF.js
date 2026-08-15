import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import CompanyHeader from './CompanyHeader.js';
import CompanyFooter from './CompanyFooter.js';
import { theme } from './pdfTheme.js';
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica', color: '#222' },
    nameDate: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    nameDateLabel: { fontFamily: 'Helvetica-Bold' },
    underline: { textDecoration: 'underline' },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    metaLabel: { fontFamily: 'Helvetica-Bold' },
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
    amountRow: { flexDirection: 'row', backgroundColor: theme.lightGreen, borderTopWidth: 1, borderTopColor: theme.border },
    amountLabel: { flex: 5, padding: 5, fontFamily: 'Helvetica-Bold', fontSize: 9 },
    amountValue: { width: 75, padding: 5, textAlign: 'right', fontSize: 9 },
    dueRow: { flexDirection: 'row', backgroundColor: theme.green, borderTopWidth: 1, borderTopColor: theme.border },
    dueLabel: { flex: 5, padding: 6, color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 11 },
    dueValue: { width: 75, padding: 6, textAlign: 'right', color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 11 },
    notesBox: { marginTop: 15 },
    notesLabel: { fontFamily: 'Helvetica-Bold', fontSize: 9, marginBottom: 3 },
    notesText: { fontSize: 9 },
    noticeBox: { backgroundColor: theme.lightGreen, padding: 12, marginTop: 30 },
    noticeText: { fontSize: 9, textAlign: 'center', fontFamily: 'Helvetica-Oblique', marginBottom: 3 },
});
const fmt = (n) => n.toLocaleString('en-LK', { minimumFractionDigits: 2 });
const InvoicePDF = ({ invoice }) => (_jsx(Document, { children: _jsxs(Page, { size: "A4", style: styles.page, children: [_jsx(CompanyHeader, {}), _jsxs(View, { style: styles.nameDate, children: [_jsxs(Text, { children: [_jsx(Text, { style: styles.nameDateLabel, children: "Bill To: " }), _jsx(Text, { style: styles.underline, children: invoice.client?.name })] }), _jsxs(Text, { children: [_jsx(Text, { style: styles.nameDateLabel, children: "Date: " }), new Date(invoice.createdAt).toLocaleDateString('en-CA').replace(/-/g, '. ')] })] }), _jsxs(View, { style: styles.metaRow, children: [_jsxs(Text, { children: [_jsx(Text, { style: styles.metaLabel, children: "Invoice #: " }), invoice.id.slice(-6).toUpperCase()] }), _jsxs(Text, { children: [_jsx(Text, { style: styles.metaLabel, children: "Due Date: " }), new Date(invoice.dueDate).toLocaleDateString('en-CA').replace(/-/g, '. ')] })] }), invoice.client?.address && (_jsxs(View, { style: { marginBottom: 10 }, children: [_jsx(Text, { style: { fontSize: 9 }, children: invoice.client.address }), invoice.project?.title && _jsxs(Text, { style: { fontSize: 9 }, children: ["Project: ", invoice.project.title] })] })), _jsxs(View, { style: styles.table, children: [Array.isArray(invoice.items) && invoice.items.length > 0 ? (_jsxs(_Fragment, { children: [_jsxs(View, { style: styles.headerRow, children: [_jsx(Text, { style: [styles.headerCell, styles.colNo], children: "No" }), _jsx(Text, { style: [styles.headerCell, styles.colDesc], children: "Description" }), _jsx(Text, { style: [styles.headerCell, styles.colQty], children: "Quantity" }), _jsx(Text, { style: [styles.headerCell, styles.colPrice], children: "Unit Price" }), _jsx(Text, { style: [styles.headerCell, styles.colTotal], children: "Total" })] }), _jsx(View, { style: styles.spacerRow }), invoice.items.map((item, i) => (_jsxs(View, { style: styles.row, children: [_jsx(Text, { style: [styles.cell, styles.colNo], children: String(i + 1).padStart(2, '0') }), _jsx(Text, { style: [styles.cell, styles.colDesc], children: item.description }), _jsx(Text, { style: [styles.cell, styles.colQty], children: item.qty }), _jsx(Text, { style: [styles.cell, styles.colPrice], children: fmt(item.unitPrice) }), _jsx(Text, { style: [styles.cell, styles.colTotal], children: fmt(item.lineTotal) })] }, i)))] })) : (_jsx(View, { style: styles.headerRow, children: _jsx(Text, { style: styles.headerCell, children: "INVOICE SUMMARY" }) })), _jsxs(View, { style: styles.amountRow, children: [_jsx(Text, { style: styles.amountLabel, children: "Total Amount" }), _jsxs(Text, { style: styles.amountValue, children: ["LKR ", fmt(invoice.totalAmount)] })] }), _jsxs(View, { style: styles.dueRow, children: [_jsx(Text, { style: styles.dueLabel, children: "Amount Due" }), _jsxs(Text, { style: styles.dueValue, children: ["LKR ", fmt(invoice.amountDue)] })] })] }), invoice.notes && (_jsxs(View, { style: styles.notesBox, children: [_jsx(Text, { style: styles.notesLabel, children: "Notes:" }), _jsx(Text, { style: styles.notesText, children: invoice.notes })] })), _jsx(CompanyFooter, {}), _jsx(View, { style: styles.noticeBox, children: _jsx(Text, { style: styles.noticeText, children: "Thank you for your business. Please make payment by the due date shown above." }) })] }) }));
export default InvoicePDF;
//# sourceMappingURL=InvoicePDF.js.map