"use client";

import { Button } from "@/components/ui/button";
import { Copy, Download, X } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicUrl: string;
  planName: string;
}

export default function QRModal({ isOpen, onClose, publicUrl, planName }: QRModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (isOpen && publicUrl) {
      generateQRCode();
    }
  }, [isOpen, publicUrl]);

  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(publicUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.download = `qr-${planName.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Código QR - {planName}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center space-y-4">
          {qrCodeDataUrl && (
            <div className="flex justify-center">
              <img src={qrCodeDataUrl} alt="QR Code" className="border rounded-lg shadow-sm" />
            </div>
          )}

          <div className="text-sm text-gray-600 space-y-2">
            <p>Escanea este código QR para acceder al plan desde cualquier dispositivo móvil</p>
            <div className="p-2 bg-gray-50 rounded text-xs break-all">{publicUrl}</div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={copyUrl} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              {copySuccess ? "¡Copiado!" : "Copiar URL"}
            </Button>

            <Button onClick={downloadQR} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Descargar QR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
