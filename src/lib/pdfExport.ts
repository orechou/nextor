import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/**
 * Export markdown content to PDF
 * Uses the preview HTML to generate a PDF with proper formatting
 */
export async function exportMarkdownToPDF(
  htmlContent: string
): Promise<Blob> {
  // 1. Create a temporary container for rendering
  const container = document.createElement('div')
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 210mm;  /* A4 width */
    padding: 20mm;
    background: white;
    color: black;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 12px;
    line-height: 1.6;
  `

  // Add the content
  container.innerHTML = htmlContent
  document.body.appendChild(container)

  try {
    // 2. Wait for any dynamic content (Mermaid diagrams, etc.) to render
    await new Promise(resolve => setTimeout(resolve, 500))

    // 3. Use html2canvas to capture the content
    const canvas = await html2canvas(container, {
      scale: 2,  // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: container.scrollWidth,
      height: container.scrollHeight
    })

    // 4. Calculate PDF dimensions
    const imgWidth = 210  // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // 5. Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

    // Return as blob
    return pdf.output('blob')
  } finally {
    // Clean up
    document.body.removeChild(container)
  }
}
