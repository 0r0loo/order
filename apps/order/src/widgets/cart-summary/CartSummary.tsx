interface CartSummaryProps {
  totalAmount: number;
  itemCount: number;
  onCartClick: () => void;
}

export const CartSummary = ({ totalAmount, itemCount, onCartClick }: CartSummaryProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            총 {totalAmount.toLocaleString()}원
          </span>
          <button
            onClick={onCartClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            카트 보기 ({itemCount})
          </button>
        </div>
      </div>
    </div>
  );
};