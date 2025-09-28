import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";

function AddressCard({
  addressInfo,
  onEdit,
  onDelete,
  setCurrentSelectedAddress,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className="border border-gray-100 rounded-lg p-4 flex justify-between items-start"
    >
      {/* Address content on left */}
      <div className="flex flex-col gap-0 text-left">
        <Label className="font-semibold text-[17px]">
          {addressInfo?.address}
        </Label>
        <Label className="text-gray-400 text-[16px] font-medium">
          {addressInfo?.city}
        </Label>
        <Label className="text-gray-400 text-[16px] font-medium">
          {addressInfo?.pincode}
        </Label>
        <Label className="text-gray-400 text-[16px] font-medium">
          {addressInfo?.phone}
        </Label>
      </div>

      {/* Action buttons on right */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          onClick={() => onEdit(addressInfo)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="cursor-pointer text-white"
          onClick={() => onDelete(addressInfo._id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export default AddressCard;
