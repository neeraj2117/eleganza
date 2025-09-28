const Address = require("../../models/Address");
const User = require("../../models/User");

const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;

    if (!userId || !address || !city || !pincode || !phone) {
      return res.status(400).json({ success: false, message: "Missing required fields!" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          addresses: { address, city, pincode, phone, notes },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    res.status(201).json({
      success: true,
      data: updatedUser.addresses, // return only addresses array
    });
  } catch (e) {
    console.error("Error adding address:", e);
    res.status(500).json({ success: false, message: "Error adding address" });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User id is required!" });
    }

    const user = await User.findById(userId).select("addresses");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    res.status(200).json({
      success: true,
      data: user.addresses, // send array of addresses
    });
  } catch (e) {
    console.error("Error fetching addresses:", e);
    res.status(500).json({ success: false, message: "Error fetching addresses" });
  }
};

const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId, "addresses._id": addressId },
      { $set: { "addresses.$": formData } }, // update matching subdoc
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User or address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user.addresses,
    });
  } catch (e) {
    console.error("Error editing address:", e);
    res.status(500).json({
      success: false,
      message: "Error editing address",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } }, // remove subdocument by id
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: updatedUser.addresses, // return remaining addresses
    });
  } catch (e) {
    console.error("Error deleting address:", e);
    res.status(500).json({
      success: false,
      message: "Error deleting address",
    });
  }
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };