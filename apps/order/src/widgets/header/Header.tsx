interface HeaderProps {
  storeName: string;
  tableNumber: number;
  currentOrders: number;
}

export const Header = ({ storeName, tableNumber, currentOrders }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">{storeName}</h1>
          <span className="text-sm text-gray-600">
            테이블 {tableNumber} ({currentOrders}명 주문중)
          </span>
        </div>
      </div>
    </header>
  );
};