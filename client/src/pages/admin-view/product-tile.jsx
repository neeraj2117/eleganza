import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full border-gray-300 font-[Rajdhani] max-w-sm mx-auto rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-48 object-cover cursor-pointer rounded-t-lg transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardContent>
          <h2 className="text-2xl font-bold mb-1 mt-2 text-left">
            {product?.title}
          </h2>

          <div className="flex justify-start gap-2 items-center">
            <span
              className={`${
                product?.salePrice > 0
                  ? "line-through text-lg font-medium text-gray-500"
                  : "text-2xl font-bold text-green-600"
              }`}
            >
              ${product?.price}
            </span>

            {product?.salePrice > 0 && (
              <span className="text-2xl text-green-600 font-bold">
                ${product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-around gap-2">
          <Button
            size="lg"
            className="cursor-pointer bg-black hover:bg-black/80"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product._id);
              setFormData(product);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(product?._id)}
            size="lg"
            className="bg-red-500 hover:bg-red-400 cursor-pointer"
          >
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
