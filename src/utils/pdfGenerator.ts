import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AboutSettings, PortfolioItem } from '../types';

export const generateCV = async (settings: AboutSettings, items: PortfolioItem[]) => {
  // We need to temporarily show the hidden CV template
  const element = document.getElementById('cv-template');
  if (!element) return;

  // Make it visible for capture
  element.style.display = 'block';
  element.style.position = 'absolute';
  element.style.top = '-9999px';
  element.style.left = '0';
  element.style.width = '800px'; // Fixed A4 width approx

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    // Calculate height to fit width
    const imgX = 0;
    const imgY = 0;
    const imgH = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', imgX, imgY, pdfWidth, imgH);
    pdf.save(`${settings.name.replace(/\s+/g, '_')}_CV.pdf`);
  } catch (err) {
    console.error('CV Generation failed', err);
    alert('Failed to generate CV. Please try again.');
  } finally {
    // Hide it again
    element.style.display = 'none';
  }
};
