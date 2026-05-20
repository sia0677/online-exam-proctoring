const { jsPDF } = require('jspdf');

/**
 * Generate a simple PDF buffer (e.g., for a certificate or report)
 * @param {string} title - Title of the PDF
 * @param {string} content - Main content of the PDF
 * @returns {Buffer} PDF document as buffer
 */
exports.generatePDF = (title, content) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text(title, 20, 20);
  
  doc.setFontSize(12);
  // Split text to fit page width
  const splitContent = doc.splitTextToSize(content, 170);
  doc.text(splitContent, 20, 40);
  
  return Buffer.from(doc.output('arraybuffer'));
};
