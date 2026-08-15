// pdf/QuotationPDF.tsx
import React from 'react';
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

const fmt = (n: number) => n.toLocaleString('en-LK', { minimumFractionDigits: 0 });

const QuotationPDF = ({ quotation }: { quotation: any }) => {
  const subtotal = quotation.total - (quotation.transportCost || 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <CompanyHeader />

        <View style={styles.nameDate}>
          <Text>
            <Text style={styles.nameDateLabel}>Name: </Text>
            <Text style={styles.underline}>{quotation.client?.name}</Text>
          </Text>
          <Text>
            <Text style={styles.nameDateLabel}>Date: </Text>
            {new Date(quotation.createdAt).toLocaleDateString('en-CA').replace(/-/g, '. ')}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, styles.colNo]}>No</Text>
            <Text style={[styles.headerCell, styles.colDesc]}>Description</Text>
            <Text style={[styles.headerCell, styles.colQty]}>Quantity</Text>
            <Text style={[styles.headerCell, styles.colPrice]}>Unit Price</Text>
            <Text style={[styles.headerCell, styles.colTotal]}>Total</Text>
          </View>

          <View style={styles.spacerRow} />

          {quotation.items.map((item: any, i: number) => (
            <View key={i} style={styles.row}>
              <Text style={[styles.cell, styles.colNo]}>{String(i + 1).padStart(2, '0')}</Text>
              <Text style={[styles.cell, styles.colDesc]}>{item.description}</Text>
              <Text style={[styles.cell, styles.colQty]}>{item.qty}</Text>
              <Text style={[styles.cell, styles.colPrice]}>{fmt(item.unitPrice)}</Text>
              <Text style={[styles.cell, styles.colTotal]}>{fmt(item.lineTotal)}</Text>
            </View>
          ))}

          <View style={styles.transportRow}>
            <Text style={styles.transportLabel}>Transport and installation</Text>
            <Text style={styles.transportValue}>{fmt(quotation.transportCost || 0)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{fmt(quotation.total)}</Text>
          </View>
        </View>

        <CompanyFooter />

        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            Thank you for considering our services. We look forward to build something great together!
          </Text>
          <Text style={styles.noticeText}>To accept this quotation, please reply with your confirmation.</Text>
          <Text style={styles.noticeBold}>This quotation is valid for 14 days from the date of issue</Text>
        </View>
      </Page>
    </Document>
  );
};

export default QuotationPDF;