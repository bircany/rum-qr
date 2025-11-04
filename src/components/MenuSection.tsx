import { MenuItem as MenuItemType } from '../lib/googleSheets';
import MenuItem from './MenuItem';

interface MenuSectionProps {
  title: string;
  items: MenuItemType[];
}

export default function MenuSection({ title, items }: MenuSectionProps) {
  const subCategories = Array.from(new Set(items.map(item => item.subCategory).filter(Boolean))) as string[];
  const hasSubCategories = subCategories.length > 0;
  const itemsWithoutSubCategory = items.filter(item => !item.subCategory);

  return (
    <section className="menu-section">
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-navy mb-3">
            {title}
          </h2>
          
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-beige"></div>
            <div className="w-2 h-2 rounded-full bg-beige"></div>
            <div className="h-px w-12 bg-beige"></div>
          </div>
        </div>
      )}

      {itemsWithoutSubCategory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {itemsWithoutSubCategory.map((item, index) => (
            <MenuItem key={`${item.productName}-${index}`} item={item} index={index} />
          ))}
        </div>
      )}

      {hasSubCategories && (
        <div className="space-y-12">
          {subCategories.map(subCategory => {
            const subCategoryItems = items.filter(item => item.subCategory === subCategory);
            
            return (
              <div key={subCategory}>
                <h3 className="text-2xl md:text-3xl font-serif text-navy mb-6 text-center">
                  {subCategory}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subCategoryItems.map((item, index) => (
                    <MenuItem key={`${item.productName}-${index}`} item={item} index={index} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

