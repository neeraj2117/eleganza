import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  SelectContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    const inputClasses =
      "border border-gray-200 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-gray-500 placeholder:text-sm placeholder:text-gray-400";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className={inputClasses}
          />
        );
        break;

      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className={inputClasses}>
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options?.map((optionItem) => (
                <SelectItem key={optionItem.id} value={optionItem.id}>
                  {optionItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className={inputClasses}
          />
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className={inputClasses}
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit} className="font-rajdhani">
      <div className="flex flex-col gap-5">
        {formControls.map((controlItem) => (
          <div
            key={controlItem.name}
            className="flex flex-col items-start gap-0"
          >
            <Label
              htmlFor={controlItem.name}
              className="text-gray-900 text-lg font-semibold"
            >
              {controlItem.label}
            </Label>

            <div className="w-full font-medium">
              {renderInputsByComponentType(controlItem)}
            </div>
          </div>
        ))}
      </div>

      <Button
        disabled={isBtnDisabled}
        className="mt-7 w-full h-10 text-base cursor-pointer bg-black text-white rounded-md"
        type="submit"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;

