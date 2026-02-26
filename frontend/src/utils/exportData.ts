import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  title?: string;
  filename?: string;
}

export const exportToCSV = (data: ExportData): void => {
  const { headers, rows, filename = 'export.csv' } = data;

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${cell}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data: ExportData): void => {
  const { headers, rows, title = 'Report', filename = 'export.pdf' } = data;

  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 20);

  // Add date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

  // Add table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 35,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  doc.save(filename);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  }).format(amount);
};

export const formatDate = (date: Date | number): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};
