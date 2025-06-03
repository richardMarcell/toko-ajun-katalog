import { Button } from "@/components/ui/button";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function ButtonPrintReport() {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    const element = reportRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("sales-report.pdf");
  };
  return <Button onClick={handlePrint}>Cetak Laporan</Button>;
}
