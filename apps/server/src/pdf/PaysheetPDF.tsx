// pdf/PaysheetPDF.tsx
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
  cellLabel: { flex: 4, padding: 5, fontSize: 9 },
  cellValue: { flex: 3, padding: 5, fontSize: 9, textAlign: 'right' },

  netPayRow: { flexDirection: 'row', backgroundColor: theme.green, borderTopWidth: 1, borderTopColor: theme.border },
  netPayLabel: { flex: 4, padding: 6, color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 11 },
  netPayValue: { flex: 3, padding: 6, textAlign: 'right', color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 11 },

  noticeBox: { backgroundColor: theme.lightGreen, padding: 12, marginTop: 30 },
  noticeText: { fontSize: 9, textAlign: 'center', fontFamily: 'Helvetica-Oblique' },
});

const fmt = (n: number) => n.toLocaleString('en-LK', { minimumFractionDigits: 2 });

const PaysheetPDF = ({ salary }: { salary: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <CompanyHeader />

      <View style={styles.nameDate}>
        <Text>
          <Text style={styles.nameDateLabel}>Worker: </Text>
          <Text style={styles.underline}>{salary.worker.name} ({salary.worker.workerId})</Text>
        </Text>
        <Text>
          <Text style={styles.nameDateLabel}>Period: </Text>
          {salary.month}/{salary.year}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>PAYSHEET</Text>
        </View>

        <View style={styles.spacerRow} />

        <View style={styles.row}>
          <Text style={styles.cellLabel}>Days Worked</Text>
          <Text style={styles.cellValue}>{salary.daysWorked}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellLabel}>Rate Type</Text>
          <Text style={styles.cellValue}>{salary.worker.rateType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellLabel}>Base Pay</Text>
          <Text style={styles.cellValue}>LKR {fmt(salary.basePay)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellLabel}>Bonuses</Text>
          <Text style={styles.cellValue}>LKR {fmt(salary.bonuses)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellLabel}>Deductions</Text>
          <Text style={styles.cellValue}>LKR {fmt(salary.deductions)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellLabel}>Daily Paid (via Ledger)</Text>
          <Text style={styles.cellValue}>LKR {fmt(salary.dailyPaid ?? 0)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cellLabel}>Advances Given</Text>
          <Text style={styles.cellValue}>LKR {fmt(salary.advancesTotal)}</Text>
        </View>

        <View style={styles.netPayRow}>
          <Text style={styles.netPayLabel}>NET PAY</Text>
          <Text style={styles.netPayValue}>LKR {fmt(salary.netPay)}</Text>
        </View>
      </View>

      <CompanyFooter />

      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>This is a computer-generated paysheet and does not require a signature.</Text>
      </View>
    </Page>
  </Document>
);

export default PaysheetPDF;