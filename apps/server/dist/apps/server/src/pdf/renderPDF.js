import ReactPDF from '@react-pdf/renderer';
export async function streamPDF(element, res, filename) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
    const stream = await ReactPDF.renderToStream(element);
    stream.pipe(res);
    return new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
    });
}
//# sourceMappingURL=renderPDF.js.map