export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);
};

export const formatPriceSimple = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

export const parseQRUrl = (url: string): { storeId: string; tableNumber: number } | null => {
  const match = url.match(/\/order\/([^/]+)\/table(\d+)/);
  if (!match) return null;

  return {
    storeId: match[1],
    tableNumber: parseInt(match[2], 10),
  };
};

export const calculateTotal = (items: Array<{ price: number; quantity: number }>): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};