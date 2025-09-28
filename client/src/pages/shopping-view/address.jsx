import CommonForm from "@/components/common/form";
import AddressMap from "@/components/shopping-view/AddressMap";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { addressFormControls } from "@/config";
import CircleMapPreview from "@/components/shopping-view/CircleMapPreview";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  fetchAllAddresses,
  editAddress,
  deleteAddress,
} from "@/store/shop/address-slice.js";
import { toast } from "sonner";
import AddressCard from "./address-card";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [position, setPosition] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  // dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // control dropdown vs form
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  // edit state
  const [editMode, setEditMode] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  useEffect(() => {
    const hasSeenDialog = localStorage.getItem("hasSeenLocationDialog");
    if (!hasSeenDialog) {
      const timer = setTimeout(() => setOpenDialog(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // When addresses are fetched, set selected id if not set
  useEffect(() => {
    if (addressList && addressList.length > 0) {
      if (!selectedAddressId) setSelectedAddressId(addressList[0]._id);
    } else {
      setSelectedAddressId("");
    }
  }, [addressList]);

  async function fetchAndSetLocation() {
    setLoadingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation not supported!");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);

          // reverse geocode
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();

          setFormData((prev) => ({
            ...prev,
            address: data.display_name || prev.address || "",
            city:
              (data.address &&
                (data.address.city ||
                  data.address.town ||
                  data.address.village)) ||
              prev.city ||
              "",
            pincode:
              (data.address && data.address.postcode) || prev.pincode || "",
          }));
        } catch (err) {
          console.error("Reverse geocode error:", err);
        } finally {
          setLoadingLocation(false);
          setOpenDialog(false);
          localStorage.setItem("hasSeenLocationDialog", "true");
        }
      },
      (err) => {
        console.error("Location error:", err);
        setLoadingLocation(false);
      }
    );
  }

  function handleAllowLocation() {
    fetchAndSetLocation();
  }

  function handleCloseDialog() {
    setOpenDialog(false);
    localStorage.setItem("hasSeenLocationDialog", "true");
  }

  // Add or Update depending on editMode
  function handleManageAddress(event) {
    event.preventDefault();
    console.log(addressList, "address listt");

    if (addressList.length >= 5 && !editMode) {
      toast.error("You can add max 3 addresses");
      return;
    }

    if (editMode && editingAddressId) {
      // update existing address
      dispatch(
        editAddress({
          userId: user?.id,
          addressId: editingAddressId,
          formData,
        })
      ).then((res) => {
        if (res?.payload?.success) {
          toast.success("Address updated successfully!");
          dispatch(fetchAllAddresses(user?.id));
          // reset form & edit state
          setFormData(initialAddressFormData);
          setEditMode(false);
          setEditingAddressId(null);
          setShowAddForm(false);
        } else {
          toast.error(res?.payload?.message || "Update failed");
        }
      });
    } else {
      // create new
      dispatch(addNewAddress({ ...formData, userId: user?.id })).then((res) => {
        if (res?.payload?.success) {
          toast.success("Address added successfully!");
          dispatch(fetchAllAddresses(user?.id));
          setFormData(initialAddressFormData);
          setShowAddForm(false);
        } else {
          toast.error(res?.payload?.message || "Add failed");
        }
      });
    }
  }

  function handleDelete(addressId) {
    if (!confirm("Delete this address?")) return;

    dispatch(deleteAddress({ userId: user?.id, addressId })).then((res) => {
      if (res?.payload?.success) {
        toast.success("Address deleted successfully!");
        dispatch(fetchAllAddresses(user?.id));

        if (selectedAddressId === addressId) {
          setSelectedAddressId("");
        }
      } else {
        toast.error(res?.payload?.message || "Delete failed");
      }
    });
  }

  function handleEdit(addr) {
    setFormData({
      address: addr.address || "",
      city: addr.city || "",
      pincode: addr.pincode || "",
      phone: addr.phone || "",
      notes: addr.notes || "",
    });
    setEditMode(true);
    setEditingAddressId(addr._id);
    setShowAddForm(true);
    // scroll into view (optional)
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function isFormValid() {
    // simple required check; adapt if some fields optional
    return ["address", "city", "phone", "pincode"].every(
      (k) => formData[k] && formData[k].toString().trim() !== ""
    );
  }

  useEffect(() => {
    if (user?.id) dispatch(fetchAllAddresses(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (addressList?.length === 1) {
      setSelectedAddressId(addressList[0]._id);
      setCurrentSelectedAddress(addressList[0]);
    }
  }, [addressList, setCurrentSelectedAddress]);


  return (
    <div className="font-[Rajdhani]">
      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-rajdhani font-semibold">
              Allow location access?
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-center gap-6 my-2">
            <CircleMapPreview
              position={position || [28.6139, 77.209]}
              zoom={15}
              label="Precise"
              borderColor="border-blue-500"
              loading={loadingLocation}
            />
            <CircleMapPreview
              position={position || [28.6139, 77.209]}
              zoom={11}
              label="Approximate"
              borderColor="border-gray-400"
              loading={loadingLocation}
            />
          </div>

          <p className="text-gray-700 text-[17px] font-medium font-rajdhani mb-4">
            We can use your current location to auto-fill your address details.
          </p>

          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              className="px-6 font-rajdhani cursor-pointer text-[16px]"
              disabled={loadingLocation}
            >
              No, thanks
            </Button>
            <Button
              onClick={handleAllowLocation}
              className="px-6 flex items-center cursor-pointer gap-2 font-rajdhani text-[16px]"
              disabled={loadingLocation}
            >
              {loadingLocation && <Loader2 className="h-4 w-4 animate-spin" />}
              {loadingLocation ? "Fetching..." : "Yes, allow"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Card */}
      <Card className="border border-gray-200 mt-6 p-4 relative">
        {/* If addresses exist and user not adding/editing */}
        {!showAddForm && addressList && addressList.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <select
                className="border border-gray-300 text-[18px] font-rajdhani rounded-md px-3 py-2 w-full text-sm"
                value={selectedAddressId || addressList[0]?._id}
                onChange={(e) => {
                  if (e.target.value === "change") {
                    setShowAddForm(true);
                  } else {
                    setSelectedAddressId(e.target.value);

                    // also update parent state with full address object
                    const selectedAddr = addressList.find(
                      (addr) => addr._id === e.target.value
                    );
                    if (selectedAddr) {
                      setCurrentSelectedAddress(selectedAddr);
                    }
                  }
                }}
              >
                {addressList.map((addr) => (
                  <option key={addr._id} value={addr._id}>
                    {addr.address} ({addr.city})
                  </option>
                ))}
                <option value="change">Change Address</option>
              </select>

              <Button
                className="bg-black cursor-pointer text-[15px] text-white px-4 py-2 rounded-md"
                onClick={() => {
                  setFormData(initialAddressFormData);
                  setEditMode(false);
                  setEditingAddressId(null);
                  setShowAddForm(true);
                }}
              >
                Add New Address
              </Button>
            </div>

            {/* Scrollable address list below dropdown */}
            <div className="max-h-110 overflow-y-auto space-y-3">
              {addressList.map((addr) => (
                <AddressCard
                  key={addr._id}
                  addressInfo={addr}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold mb-3">
                {editMode ? "Edit Address" : "Add New Address"}
              </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Form */}
              <CommonForm
                formControls={addressFormControls}
                formData={formData}
                setFormData={setFormData}
                buttonText={editMode ? "Save Changes" : "Save"}
                onSubmit={handleManageAddress}
                isBtnDisabled={!isFormValid()}
              />

              {/* Right: Map */}
              <div className="w-full h-full min-h-[300px] relative">
                {position ? (
                  <AddressMap position={position} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center border border-gray-200 rounded-md">
                    <p className="text-gray-500 text-sm font-rajdhani">
                      No location selected
                    </p>
                  </div>
                )}

                {/* Button for current location */}
                <Button
                  onClick={fetchAndSetLocation}
                  className="absolute top-2 right-2 bg-black hover:bg-black/80 cursor-pointer text-[16px] text-white px-5 py-1 rounded-md flex items-center gap-2"
                  disabled={loadingLocation}
                >
                  {loadingLocation && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Use My Current Location
                </Button>
              </div>
            </CardContent>

            {/* Cancel button if user has saved addresses */}
            {addressList && addressList.length > 0 && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData(initialAddressFormData);
                    setEditMode(false);
                    setEditingAddressId(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

export default Address;
