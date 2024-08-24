import db from "../models/index.js";
import { Op } from "sequelize";

const User = db.tbl_user;
const Stuff = db.tbl_stuff;
const Type_Stuff = db.tbl_type_stuff;

export const deleteStuff = async (req, res) => {
  const { id } = req.params;
  const dataBefore = await Stuff.findOne({
    where: { id },
  });
  const parsedDataProfile = JSON.parse(JSON.stringify(dataBefore));

  if (!parsedDataProfile) {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Stuffs Account doesn't exist or has been deleted!",
    });
  }

  await Stuff.destroy({
    where: { id },
  });

  return res.status(200).json({
    code: 200,
    status: true,
    msg: "Delete Data Stuff Successfully",
    data: dataBefore,
  });
};

export const RegisterStuff = async (req, res) => {
  const { name_stuff, price, type_stuff, disc, qty, deskripsi } = req.body;

  try {
    const stuff = await Stuff.create({
      name_stuff,
      price,
      type_stuff,
      disc,
      deskripsi,
      user_id: req.user.userId,
      image: `http://localhost:8000/image/${req.file.filename}`,
      qty,
    });
    res.status(200).json({
      code: 200,
      status: true,
      msg: "Register Data Stuff berhasil",
      data: stuff,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getDataStuff = async (req, res) => {
  try {
    const stuff = await Stuff.findAll({
      include: {
        model: Type_Stuff,
        as: "type",
      },
    });
    res.status(200).json({
      code: 200,
      status: true,
      msg: "This Data All Stuff",
      data: stuff,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getDataStuffId = async (req, res) => {
  const { id } = req.params;
  try {
    const stuff = await Stuff.findOne({
      where: { id: id },
    });
    if (!stuff) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Data Doesn't Exist",
      });
    }
    res.status(200).json({
      code: 200,
      status: true,
      msg: "data you searched Found",
      data: stuff,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateDataStuff = async (req, res) => {
  const { id } = req.params;
  const { name_stuff, price, type_stuff, disc, qty, deskripsi } = req.body;

  try {
    const data_before = await Stuff.findOne({
      where: { id },
    });

    if (!data_before) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Stuffs doesn't exist or has been deleted!",
      });
    }

    await Stuff.update(
      {
        name_stuff,
        price,
        type_stuff,
        disc,
        image: `http://localhost:8000/image/${req.file.filename}`,
        qty,
        deskripsi,
      },
      {
        where: { id },
      }
    );

    const data_update = await Stuff.findOne({
      where: { id },
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Stuffs Success Updated",
      data: { data_before, data_update },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getDataStuffBy = async (req, res) => {
  try {
    const { search } = req.params;
    let stuff = await Stuff.findAll({
      where: {
        [Op.or]: [{ name_stuff: { [Op.like]: `%` + search + `%` } }],
      },
    });
    if (!stuff) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Data Barang Doesn't Existing",
      });
    }
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "data user you searched Found",
      data: stuff,
    });
  } catch (error) {
    console.log(error);
  }
};
