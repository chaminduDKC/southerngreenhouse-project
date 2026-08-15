// pdf/CompanyHeader.tsx
import React from 'react';
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

const CompanyHeader = () => (
  <View style={styles.headerRow}>
    <Image src={COMPANY.logoUrl} style={styles.logo} />
    <View style={styles.headerText}>
      <Text style={styles.companyName}>{COMPANY.name}</Text>
      <View style={styles.taglineRow}>
        <View style={styles.taglineCol}>
          {COMPANY.tagline.map((pair, i) => (
            <Text key={i} style={styles.taglineItem}>
              {pair[0] ? `•  ${pair[0]}` : ''}
            </Text>
          ))}
        </View>
        <View style={styles.taglineCol}>
          {COMPANY.tagline.map((pair, i) => (
            <Text key={i} style={styles.taglineItem}>
              {pair[1] ? `•  ${pair[1]}` : ''}
            </Text>
          ))}
        </View>
      </View>
    </View>
  </View>
);

export default CompanyHeader;