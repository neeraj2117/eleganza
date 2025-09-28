// const Product = require("../../models/Product");

// const searchProducts = async (req, res) => {
//   try {
//     const {keyword} = req.params;

//     if (!keyword || typeof keyword !== 'string') {
//         return res.status(400).jon({
//             success: false,
//             message: 'KEyowrd is required and must be in string format'
//         });
//     }

//     const regEx = new RegExp(keyword, 'i')

//     const createSearchQuery = {
//         $or: [
//             {title: regEx},
//             {description: regEx},
//             {category: regEx},
//             {brand: regEx}
//         ]
//     }

//     const searchResults = await Product.find(createSearchQuery);

//     res.status(200).json({
//       success: true,
//       data: searchResults
//     });
//   } catch (e) {
//     console.error("Error adding address:", e);
//     res.status(500).json({ success: false, message: "Error" });
//   }
// };

// module.exports = {searchProducts};
const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be a string",
      });
    }

    // Split keyword into words, create regex for each
    const words = keyword.trim().split(/\s+/);
    const regexConditions = words.map((word) => new RegExp(word, "i"));

    // Build query: match if ANY word matches ANY field
    const createSearchQuery = {
      $or: regexConditions.flatMap((regex) => [
        { title: regex },
        { description: regex },
        { category: regex },
        { brand: regex },
      ]),
    };

    const searchResults = await Product.find(createSearchQuery);

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (e) {
    console.error("Error searching products:", e);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { searchProducts };
