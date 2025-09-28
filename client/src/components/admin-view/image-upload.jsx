import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    const response = await axios.post(
      "http://localhost:4000/api/admin/products/upload-image",
      data
    );
    if (response?.data?.success) {
      setUploadedImageUrl(response.data.result.url);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className={`w-full font-[Rajdhani] mt-5 ${isCustomStyling ? '' : 'max-w-md mx-auto'}`}>
      <Label className="text-lg text-black font-semibold mb-.5 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-gray-300 font-extralight border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />

        {uploadedImageUrl ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <img
              src={uploadedImageUrl}
              alt="Uploaded"
              className="h-32 w-32 object-cover rounded-md"
            />
            {isEditMode && (
              <p className="text-sm text-gray-500 italic">
                Image cannot be changed in edit mode
              </p>
            )}
          </div>
        ) : !imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : "cursor-pointer"
            } flex flex-col items-center justify-center h-25 w-full`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-1" />
            <span className="text-[16px] text-gray-500">Drag & drop or click to upload images.</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 w-32 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <FileIcon className="w-7 h-7 text-primary mr-2" />
              <p className="text-sm font-medium">{imageFile.name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove Files</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
