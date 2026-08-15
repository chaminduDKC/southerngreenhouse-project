import ReactPDF from '@react-pdf/renderer';
import React from 'react';
import type { Response } from 'express';

export async function streamPDF(element: React.ReactElement, res: Response, filename: string) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
  const stream = await ReactPDF.renderToStream(element);
  stream.pipe(res);
  return new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });
}
