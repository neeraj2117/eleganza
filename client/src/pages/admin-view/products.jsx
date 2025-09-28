import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  fetchAllProducts,
  updateProduct,
} from "@/store/admin/product_slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import AdminProductTile from "./product-tile";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList, loading } = useSelector((state) => state.adminProducts);
  const dispatcher = useDispatch();

  // Submit new product
  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      dispatcher(
        updateProduct({
          id: currentEditedId,
          formData: {
            ...formData,
            image: uploadedImageUrl,
          },
        })
      ).then((data) => {
        if (data?.payload?._id) {
          dispatcher(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          setCurrentEditedId(null);
          toast.success("Product Edited Successfully!");
        } else {
          toast.error("Failed to edit product. Try again!");
        }
      });
    } else {
      // Adding new product
      dispatcher(
        addNewProduct({
          ...formData,
          image: uploadedImageUrl,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatcher(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          toast.success("Product Added Successfully!");
        } else {
          toast.error("Failed to add product. Try again!");
        }
      });
    }
  }

  // handle delete
  function handleDelete(getCurrentProductId) {
    dispatcher(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success){
        dispatcher(fetchAllProducts());
      }else{

      }
    })
  }

  // check form valid
  function isFormValid() {
    return Object.keys(formData).map(key => formData[key] !== '').every(item => item);
  }

  useEffect(() => {
    dispatcher(fetchAllProducts());
  }, [dispatcher]);

  return (
    <Fragment>
      <div className="mb-6 font-[Rajdhani] w-full flex justify-between items-center">
        <h2 className="text-3xl font-semibold tracking-tight">All Products</h2>
        <Button
          onClick={() => setOpenCreateProductsDialog(true)}
          className="cursor-pointer text-[15px]"
        >
          + Add New Product
        </Button>
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="flex justify-center py-20 text-gray-500">
          Loading products...
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productList && productList.length > 0 ? (
            [...productList]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
              .map((productItem) => (
                <AdminProductTile
                  setFormData={setFormData}
                  setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                  setCurrentEditedId={setCurrentEditedId}
                  key={productItem._id}
                  product={productItem}
                  handleDelete={handleDelete}
                />
              ))
          ) : (
            <div className="col-span-full flex flex-col items-center text-gray-500 py-10">
              <p className="text-lg">No products found</p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => setOpenCreateProductsDialog(true)}
              >
                Add your first product
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Slide-over for adding new product */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent
          side="right"
          className="overflow-auto w-full sm:max-w-md md:max-w-sm lg:max-w-md"
        >
          <SheetHeader>
            <SheetTitle>
              <div className="border-b font-[Rajdhani] border-gray-200 pb-2 text-gray-900 text-xl font-medium">
                {currentEditedId !== null ? "Edit Product" : "Add Product"}
              </div>
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="py-4">
            <CommonForm
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              buttonText={
                currentEditedId !== null ? "Edit Product" : "Add Product"
              }
              onSubmit={onSubmit}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
