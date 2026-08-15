// pdf/CompanyFooter.tsx
import React from 'react';
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

const CompanyFooter = () => (
  <View style={styles.footerRow}>
    <View style={styles.col}>
      <Text style={[styles.red, styles.label]}>Tel :</Text>
      {COMPANY.phones.map((p, i) => (
        <Text key={i} style={styles.red}>{p}</Text>
      ))}
    </View>
    <View style={styles.col}>
      <Text style={[styles.red, styles.label]}>Address</Text>
      {COMPANY.address.map((line, i) => (
        <Text key={i} style={styles.red}>{line}</Text>
      ))}
    </View>
    <View style={styles.col}>
      <Text style={styles.label}>Like us On:</Text>
      <Link src={COMPANY.facebook.url} style={styles.blue}>{COMPANY.facebook.label}</Link>
      <Link src={`mailto:${COMPANY.email}`} style={styles.blue}>{COMPANY.email}</Link>
    </View>
  </View>
);

export default CompanyFooter;