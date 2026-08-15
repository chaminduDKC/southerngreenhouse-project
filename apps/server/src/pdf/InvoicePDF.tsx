// pdf/InvoicePDF.tsx
import React from 'react';
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

const fmt = (n: number) => n.toLocaleString('en-LK', { minimumFractionDigits: 2 });

const InvoicePDF = ({ invoice }: { invoice: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <CompanyHeader />

      <View style={styles.nameDate}>
        <Text>
          <Text style={styles.nameDateLabel}>Bill To: </Text>
          <Text style={styles.underline}>{invoice.client?.name}</Text>
        </Text>
        <Text>
          <Text style={styles.nameDateLabel}>Date: </Text>
          {new Date(invoice.createdAt).toLocaleDateString('en-CA').replace(/-/g, '. ')}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Text>
          <Text style={styles.metaLabel}>Invoice #: </Text>
          {invoice.id.slice(-6).toUpperCase()}
        </Text>
        <Text>
          <Text style={styles.metaLabel}>Due Date: </Text>
          {new Date(invoice.dueDate).toLocaleDateString('en-CA').replace(/-/g, '. ')}
        </Text>
      </View>

      {invoice.client?.address && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 9 }}>{invoice.client.address}</Text>
          {invoice.project?.title && <Text style={{ fontSize: 9 }}>Project: {invoice.project.title}</Text>}
        </View>
      )}

      <View style={styles.table}>
        {Array.isArray(invoice.items) && invoice.items.length > 0 ? (
          <>
            <View style={styles.headerRow}>
              <Text style={[styles.headerCell, styles.colNo]}>No</Text>
              <Text style={[styles.headerCell, styles.colDesc]}>Description</Text>
              <Text style={[styles.headerCell, styles.colQty]}>Quantity</Text>
              <Text style={[styles.headerCell, styles.colPrice]}>Unit Price</Text>
              <Text style={[styles.headerCell, styles.colTotal]}>Total</Text>
            </View>

            <View style={styles.spacerRow} />

            {invoice.items.map((item: any, i: number) => (
              <View key={i} style={styles.row}>
                <Text style={[styles.cell, styles.colNo]}>{String(i + 1).padStart(2, '0')}</Text>
                <Text style={[styles.cell, styles.colDesc]}>{item.description}</Text>
                <Text style={[styles.cell, styles.colQty]}>{item.qty}</Text>
                <Text style={[styles.cell, styles.colPrice]}>{fmt(item.unitPrice)}</Text>
                <Text style={[styles.cell, styles.colTotal]}>{fmt(item.lineTotal)}</Text>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>INVOICE SUMMARY</Text>
          </View>
        )}

        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>LKR {fmt(invoice.totalAmount)}</Text>
        </View>

        <View style={styles.dueRow}>
          <Text style={styles.dueLabel}>Amount Due</Text>
          <Text style={styles.dueValue}>LKR {fmt(invoice.amountDue)}</Text>
        </View>
      </View>

      {invoice.notes && (
        <View style={styles.notesBox}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText}>{invoice.notes}</Text>
        </View>
      )}

      <CompanyFooter />

      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>Thank you for your business. Please make payment by the due date shown above.</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;