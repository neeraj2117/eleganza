import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { filterOptions } from "@/config";
import { Label } from "@radix-ui/react-label";
import { Fragment } from "react";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-background rounded-lg">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-2xl font-rajdhani font-extrabold text-left">
          Filters
        </h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem, i) => (
          <Fragment key={i}>
            <div>
              <h3 className="text-xl font-rajdhani font-bold text-left">
                {keyItem}
              </h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option, j) => (
                  <Label
                    key={j}
                    className="flex font-rajdhani font-medium items-center gap-2"
                  >
                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] && filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            {i < Object.keys(filterOptions).length - 1 && <Separator />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
