import { FilterCategoryItem } from "@/app/interfaces/apiRes.interfaces";

export const findCategoryInTree = (
  categories: FilterCategoryItem[],
  target: string,
): FilterCategoryItem | undefined => {
  for (const cat of categories) {
    if (cat.slug === target || cat.id === target) return cat;
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryInTree(cat.children, target);
      if (found) return found;
    }
  }
  return undefined;
};
