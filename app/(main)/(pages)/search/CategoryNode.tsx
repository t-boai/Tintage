// interfaces
import { FilterCategoryItem } from "@/app/interfaces/apiRes.interfaces";

// shad
import { Checkbox } from "@/components/ui/checkbox";

export const CategoryNode = ({
  cat,
  depth = 0,
  isChecked,
  onCheck,
}: {
  cat: FilterCategoryItem;
  depth?: number;
  isChecked: (key: string, val: string) => boolean;
  onCheck: (key: string, val: string) => void;
}) => {
  const hasChildren = cat.children && cat.children.length > 0;
  const isCheckedState = isChecked("category", cat.slug || "");

  const isRoot = depth === 0;
  const isLevel1 = depth === 1;

  const isDisabled = cat.disabled;

  return (
    <div className="relative flex flex-col">
      <div
        className={`-mx-2 flex items-center space-x-3 rounded-md px-2 py-1.5 transition-colors ${
          isDisabled ? "opacity-50" : "hover:bg-neutral-50"
        } ${isRoot ? "mt-2" : ""}`}
      >
        <Checkbox
          id={`cat-${cat.slug}`}
          checked={isCheckedState}
          disabled={isDisabled}
          onCheckedChange={() =>
            !isDisabled && onCheck("category", cat.slug || "")
          }
          className={`rounded-full data-[state=checked]:border-(--primaryCus) data-[state=checked]:bg-(--primaryCus) ${
            isRoot ? "h-4 w-4" : "h-3.5 w-3.5"
          } ${isDisabled ? "cursor-not-allowed border-neutral-200" : "cursor-pointer border-neutral-300"}`}
        />
        <label
          htmlFor={`cat-${cat.slug}`}
          className={`flex flex-1 items-center justify-between transition-colors ${
            isDisabled
              ? "cursor-not-allowed text-neutral-400"
              : "cursor-pointer text-neutral-700 hover:text-(--primaryCus)"
          } ${
            isRoot
              ? "text-[13px] font-bold"
              : isLevel1
                ? "text-[13px] font-semibold"
                : "text-xs font-medium"
          } ${isCheckedState && !isDisabled ? "text-(--primaryCus)" : ""}`}
        >
          <span>{cat.name}</span>
          <span
            className={`text-[10px] ${isRoot ? "font-bold" : "font-medium"} ${isDisabled ? "text-neutral-300" : "text-neutral-400"}`}
          >
            {cat.count || 0}
          </span>
        </label>
      </div>

      {hasChildren && (
        <div className="relative mt-1 ml-1.75 flex flex-col gap-0.5 border-l-2 border-neutral-100 pl-4">
          {[...cat.children!]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((child) => (
              <CategoryNode
                key={child.id}
                cat={child}
                depth={depth + 1}
                isChecked={isChecked}
                onCheck={onCheck}
              />
            ))}
        </div>
      )}
    </div>
  );
};
