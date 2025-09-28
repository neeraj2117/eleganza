// import { StarIcon } from "lucide-react";
// import { Button } from "../ui/button";

// function StarRatingComponent({ rating, handleRatingChange }) {
//   console.log(rating, "rating");

//   return [1, 2, 3, 4, 5].map((star) => (
//     <Button
//       className={`p-2 rounded-full cursor-pointer font-[Rajdhani] transition-colors ${
//         star <= rating
//           ? "text-yellow-500 hover:bg-black"
//           : "text-black hover:bg-primary hover:text-primary-foreground"
//       }`}
//       variant="outline"
//       size="icon"
//       onClick={handleRatingChange ? () => handleRatingChange(star) : null}
//     >
//       <StarIcon
//         className={`w-6 h-6 ${
//           star <= rating ? "fill-yellow-500" : "fill-black border-none"
//         }`}
//       />
//     </Button>
//   ));
// }

// export default StarRatingComponent;


import { StarIcon } from "lucide-react";

function StarRatingComponent({ rating, handleRatingChange, readOnly = false }) {
  return [1, 2, 3, 4, 5].map((star) => {
    const isFilled = star <= rating;

    // Gold if filled, gray if not
    const starClasses = isFilled
      ? "w-5 h-5 text-yellow-500 fill-yellow-500"
      : "w-5 h-5 text-gray-300 fill-gray-300";

    if (readOnly) {
      // ⭐ Read-only stars (reviews shown)
      return (
        <StarIcon
          key={star}
          className={starClasses}
          strokeWidth={0} // removes outline look
        />
      );
    }

    // ⭐ Interactive stars (write review)
    return (
      <div
        key={star}
        onClick={handleRatingChange ? () => handleRatingChange(star) : null}
        className="cursor-pointer"
      >
        <StarIcon
          className={`${starClasses} hover:text-yellow-400 hover:fill-yellow-400 transition-colors`}
          strokeWidth={0}
        />
      </div>
    );
  });
}

export default StarRatingComponent;
