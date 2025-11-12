import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// Format orders data for Excel export
export const formatOrdersForExport = (orders: any[]) => {
  return orders.map((order, index) => ({
    'S.No': index + 1,
    'Order Number': order.orderNumber,
    'Is Replacement': order.isReplacement,
    'Old Order Number': order.oldOrderNumber??"N/A",
    'Order Date': order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '',
    'Status': order.orderStatus,
    'Reviewer Name': order.reviewerName,
    'Reviewer Email': order.reviewerEmail,
    'Reviewer Phone': order.reviewerPhone,
    'Product Name': order.productName,
    'Product Brand Name': order.productBrand,
    'Product Code': order.productCode,
    'Product Brand Code': order.brandCode,
    'Platform': order.platform,
    'Mediator Name': order.mediatorName,
    'Mediator Phone': order.mediatorPhone,
    'Mediator Email': order.mediatorEmail,
    'Order Amount': order.orderAmount,
    'Less Price': order.lessPrice,
    'Refund Amount': (parseInt(order.orderAmount) -parseInt(order.lessPrice)),
    'Deal Type': order.dealType,
    'Exchange Product':order.exchangeProduct,
    'Rating/Review': order.ratingOrReview,
    'Order Screenshot': order.orderSS,
    'Price Breakup SS': order.priceBreakupSS,
    'order form date': order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
  }));
};

export const formatRefundsForExport = (refunds:any[]) => {
  
  return refunds.map((refund, index) => ({
    'S.No': index + 1,
    'Order Number': refund.orderNumber,
    'Old Order Number': refund.oldOrderNumber || '',
    'Order Date': refund.orderDate,
    'Reviewer Name': refund.customerName,
    'Reviewer Email': refund.customerEmail,
    'Reviewer Phone': refund.customerPhone,
    'Product Name': refund.productName,
    'Product Brand': refund.productBrand,
    'Product Code': refund.productCode,
    'Platform': refund.platform,
    'Mediator Name': refund.mediatorName,
    'Mediator Email': refund.mediatorEmail,
    'Order Amount': refund.orderAmount,
    'Less Price': refund.lessPrice,
    'Deal Type': refund.dealType,
    'Exchange Product': refund.exchangeProduct || '',
    'Is Replacement': refund.isReplacement,
    'Rating/Review Type': refund.ratingOrReview,
    'Refund Status': refund.refundStatus,
    'UPI ID': refund.upiId || '',
    'Bank Account Number': refund.bankInfo?.accountNumber || '',
    'Bank IFSC Code': refund.bankInfo?.ifscCode || '',
    'Review Link': refund.reviewLink || '',
    'Delivered Screenshot': refund.deliveredSS || '',
    'Review Screenshot': refund.reviewSS || '',
    'Seller Feedback Screenshot': refund.sellerFeedbackSS || '',
    'Return Window Screenshot': refund.returnWindowSS || '',
    'Return Window Closed': refund.isReturnWindowClosed ? 'YES' : 'NO',
    'Payment Status': refund.refundStatus === 'payment_done' ? 'DONE' : 'PENDING',
    'Created At': refund.createdAt ? new Date(refund.createdAt).toLocaleDateString() : '',
    'Updated At': refund.updatedAt ? new Date(refund.updatedAt).toLocaleDateString() : '',
  }));
};

// Export data to Excel
export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  // Save file
  saveAs(blob, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};