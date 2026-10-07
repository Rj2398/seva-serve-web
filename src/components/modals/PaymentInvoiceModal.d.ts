import React from "react";

export interface PaymentInvoiceModalProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
  isDownloadInvoice?: boolean;
  invoiceUrl?: string;
  onDownloadInvoice?: () => void;
  onBookingClick?: () => void;
}

declare const PaymentInvoiceModal: React.FC<PaymentInvoiceModalProps>;

export default PaymentInvoiceModal;
