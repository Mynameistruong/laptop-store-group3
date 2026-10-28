export function formatPrice(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getSellingPrice(laptop) {
  if (!laptop) return 0;
  return laptop.salePrice ?? laptop.price ?? 0;
}

export function getDiscountPercent(laptop) {
  if (!laptop || !laptop.price || !laptop.salePrice) return 0;
  return Math.round(((laptop.price - laptop.salePrice) / laptop.price) * 100);
}
