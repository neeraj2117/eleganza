// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { brandOptionsMap, categoryOptionsMap } from "@/config";
// import { Loader2 } from "lucide-react";

// function ShoppingProductTile({
//   product,
//   handleGetProductDetails,
//   handleAddtoCart,
//   isAddingToCart,
// }) {
//   const discountPercent =
//     product?.salePrice > 0
//       ? Math.round(((product.price - product.salePrice) / product.price) * 100)
//       : 0;

//   const isOutOfStock = product?.totalStock === 0;

//   return (
//     <Card
//       className={`w-full max-w-sm cursor-pointer mx-auto border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden group ${
//         isOutOfStock ? "bg-gray-100 opacity-80" : "bg-white"
//       }`}
//     >
//       {/* Product Image */}
//       <div
//         onClick={() => !isOutOfStock && handleGetProductDetails(product?._id)}
//         className="relative overflow-hidden"
//       >
//         <img
//           src={product?.image}
//           alt={product?.title}
//           className={`w-full h-[280px] object-cover transform transition-transform duration-500 ${
//             !isOutOfStock && "group-hover:scale-105"
//           }`}
//         />

//         {/* Badges */}
//         <div className="absolute top-3 left-3 flex flex-col items-start space-y-2">
//           {isOutOfStock ? (
//             <Badge className="px-2 py-1 text-[11px] rounded-full bg-gray-500 text-white font-rajdhani">
//               OUT OF STOCK
//             </Badge>
//           ) : (
//             <>
//               {product?.totalStock > 0 && product?.totalStock < 10 && (
//                 <Badge className="px-2 py-1 text-[11px] rounded-full bg-orange-500 hover:bg-orange-600 text-white font-rajdhani">
//                   Few Left
//                 </Badge>
//               )}

//               {product?.salePrice > 0 && (
//                 <Badge className="px-2 py-1 text-[11px] rounded-full bg-red-500 hover:bg-red-600 text-white font-rajdhani">
//                   SALE
//                 </Badge>
//               )}
//             </>
//           )}
//         </div>

//         {/* Right Badge - Discount % */}
//         {!isOutOfStock && discountPercent > 0 && (
//           <Badge className="absolute top-3 right-3 px-2 py-1 text-[11px] rounded-full bg-green-600 hover:bg-green-700 text-white font-rajdhani">
//             {discountPercent}% OFF
//           </Badge>
//         )}
//       </div>

//       {/* Product Details */}
//       <CardContent className="p-4 font-rajdhani">
//         <h2 className="text-2xl font-bold text-left mb-1 line-clamp-1">
//           {product?.title}
//         </h2>
//         <div className="flex items-center justify-between mb-2 text-xl text-muted-foreground">
//           <span>{categoryOptionsMap[product?.category]}</span>
//           <span>{brandOptionsMap[product?.brand]}</span>
//         </div>

//         {/* Price Section */}
//         <div className="flex items-center gap-2">
//           <span
//             className={`${
//               product?.salePrice > 0
//                 ? "line-through text-gray-400 text-lg"
//                 : "text-2xl font-bold text-green-600"
//             }`}
//           >
//             ${product?.price}
//           </span>

//           {product?.salePrice > 0 && !isOutOfStock && (
//             <span className="text-2xl font-bold text-green-600">
//               ${product?.salePrice}
//             </span>
//           )}
//         </div>
//       </CardContent>

//       {/* Footer */}
//       <CardFooter>
//         {isOutOfStock ? (
//           <Button className="w-full font-rajdhani font-semibold opacity-60 cursor-not-allowed bg-gray-500 text-white">
//             Out Of Stock
//           </Button>
//         ) : (
//           <Button
//             onClick={() => handleAddtoCart(product._id || product.id)}
//             disabled={isAddingToCart}
//             className="w-full font-rajdhani font-semibold cursor-pointer"
//           >
//             {isAddingToCart ? (
//               <span className="flex items-center gap-2">
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Adding...
//               </span>
//             ) : (
//               "Add to Cart"
//             )}
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// }

// export default ShoppingProductTile;

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Loader2 } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
  isAddingToCart,
  cartItems = [],
}) {
  const discountPercent =
    product?.salePrice > 0
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const cartQuantity =
    (Array.isArray(cartItems?.items)
      ? cartItems.items.find((item) => item.productId === product._id)
      : {}
    )?.quantity || 0;

  const isOutOfStock = product?.totalStock === 0;
  const isMaxLimitReached = cartQuantity >= product?.totalStock;

  return (
    <Card
      className={`w-full max-w-sm cursor-pointer mx-auto border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden group ${
        isOutOfStock ? "bg-gray-100 opacity-80" : "bg-white"
      }`}
    >
      {/* Product Image */}

      {/* <div
        onClick={() => !isOutOfStock && handleGetProductDetails(product?._id)}
        className="relative overflow-hidden"
      >
        <img
          src={product?.image}
          alt={product?.title}
          className={`w-full h-[280px] object-cover transform transition-transform duration-500 ${
            !isOutOfStock && "group-hover:scale-105"
          }`}
        />
        <div className="absolute top-3 left-3 flex flex-col items-start space-y-2">
          {isOutOfStock ? (
            <Badge className="px-2 py-1 text-[11px] rounded-full bg-gray-500 text-white font-rajdhani">
              OUT OF STOCK
            </Badge>
          ) : (
            <>
              {product?.totalStock > 0 && product?.totalStock < 10 && (
                <Badge className="px-2 py-1 text-[11px] rounded-full bg-orange-500 hover:bg-orange-600 text-white font-rajdhani">
                  Few Left
                </Badge>
              )}

              {product?.salePrice > 0 && (
                <Badge className="px-2 py-1 text-[11px] rounded-full bg-red-500 hover:bg-red-600 text-white font-rajdhani">
                  SALE
                </Badge>
              )}
            </>
          )}
        </div>
        {!isOutOfStock && discountPercent > 0 && (
          <Badge className="absolute top-3 right-3 px-2 py-1 text-[11px] rounded-full bg-green-600 hover:bg-green-700 text-white font-rajdhani">
            {discountPercent}% OFF
          </Badge>
        )}
      </div> */}
      <div
        onClick={() => {
          if (!isOutOfStock && !isMaxLimitReached) {
            handleGetProductDetails(product?._id);
          }
        }}
        className={`relative overflow-hidden ${
          isOutOfStock || isMaxLimitReached
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        }`}
      >
        <img
          src={product?.image}
          alt={product?.title}
          className={`w-full h-[280px] object-cover transform transition-transform duration-500 ${
            !isOutOfStock && !isMaxLimitReached && "group-hover:scale-105"
          }`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col items-start space-y-2">
          {isOutOfStock ? (
            <Badge className="px-2 py-1 text-[11px] rounded-full bg-gray-500 text-white font-rajdhani">
              OUT OF STOCK
            </Badge>
          ) : isMaxLimitReached ? (
            <Badge className="px-2 py-1 text-[11px] rounded-full bg-gray-400 text-white font-rajdhani">
              MAX LIMIT
            </Badge>
          ) : (
            <>
              {product?.totalStock > 0 && product?.totalStock < 10 && (
                <Badge className="px-2 py-1 text-[11px] rounded-full bg-orange-500 hover:bg-orange-600 text-white font-rajdhani">
                  Few Left
                </Badge>
              )}
              {product?.salePrice > 0 && (
                <Badge className="px-2 py-1 text-[11px] rounded-full bg-red-500 hover:bg-red-600 text-white font-rajdhani">
                  SALE
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Right Badge - Discount % */}
        {!isOutOfStock && !isMaxLimitReached && discountPercent > 0 && (
          <Badge className="absolute top-3 right-3 px-2 py-1 text-[11px] rounded-full bg-green-600 hover:bg-green-700 text-white font-rajdhani">
            {discountPercent}% OFF
          </Badge>
        )}
      </div>

      {/* Product Details */}
      <CardContent className="p-4 font-rajdhani">
        <h2 className="text-2xl font-bold text-left mb-1 line-clamp-1">
          {product?.title}
        </h2>
        <div className="flex items-center justify-between mb-2 text-xl text-muted-foreground">
          <span>{categoryOptionsMap[product?.category]}</span>
          <span>{brandOptionsMap[product?.brand]}</span>
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-2">
          <span
            className={`${
              product?.salePrice > 0
                ? "line-through text-gray-400 text-lg"
                : "text-2xl font-bold text-green-600"
            }`}
          >
            ${product?.price}
          </span>

          {product?.salePrice > 0 && !isOutOfStock && (
            <span className="text-2xl font-bold text-green-600">
              ${product?.salePrice}
            </span>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter>
        {isOutOfStock ? (
          <Button className="w-full font-rajdhani font-semibold opacity-60 cursor-not-allowed bg-gray-500 text-white">
            Out Of Stock
          </Button>
        ) : isMaxLimitReached ? (
          <Button className="w-full font-rajdhani font-semibold opacity-60 cursor-not-allowed bg-gray-400 text-white">
            Max Limit Reached
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product._id || product.id)}
            disabled={isAddingToCart}
            className="w-full font-rajdhani font-semibold cursor-pointer"
          >
            {isAddingToCart ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </span>
            ) : (
              "Add to Cart"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
