interface CategoryTabsProps {
  categories: Array<{ id: string; name: string; }>;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryTabs = ({ categories, selectedCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="sticky top-14 bg-white border-b border-gray-200 z-10">
      <div className="flex overflow-x-auto px-4 py-2 space-x-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`whitespace-nowrap pb-2 text-sm font-medium ${
              selectedCategory === category.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};