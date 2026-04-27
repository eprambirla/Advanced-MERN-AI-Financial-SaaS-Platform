import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

const BulkExportButton = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/transaction/export`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const csvContent = await response.text();
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast.error("Failed to export transactions");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={isExporting}
    >
      <Download className="w-4 h-4" />
      Bulk Export
    </Button>
  );
};

export default BulkExportButton;