import { pdfjs } from 'react-pdf';

// Configure worker BEFORE any PDF operations
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs?v=${pdfjs.version}`;

console.log('PDF.js worker configured:', pdfjs.GlobalWorkerOptions.workerSrc);

export default pdfjs;
