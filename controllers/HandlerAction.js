import db from "../models/index.js";

const User = db.tbl_user;
const Stuff = db.tbl_stuff;
const Type_Stuff = db.tbl_type_stuff;

export const handleGetRoot = async (req, res) => {
  res.status(200).json({
    code: 200,
    status: "OK",
    msg: "E-Permission Status Activated",
  });
};

export const Dashboard = async (req, res) => {
  try {
    let stuffCount;
    let typeStuffCount;

    if (req.user.userId == 1) {
      stuffCount = await Stuff.count();
      typeStuffCount = await Type_Stuff.count();
    } else if (req.user.userId == 2) {
      stuffCount = await Stuff.count();
    }

    const responseData = {
      barang: stuffCount,
    };

    if (req.user.userId == 1) {
      responseData.kategori_barang = typeStuffCount;
    }

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Dashboard data retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error retrieving dashboard data:", error);
    return res.status(500).json({
      code: 500,
      status: false,
      msg: "Internal server error",
    });
  }
};
