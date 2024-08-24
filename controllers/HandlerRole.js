import db from "../models/index.js";
import { Op } from "sequelize";

const Role = db.tbl_role;

export const deleteRole = async (req, res) => {
  const { id } = req.params;
  const dataBefore = await Role.findOne({
    where: { id },
  });
  const parsedDataProfile = JSON.parse(JSON.stringify(dataBefore));

  if (!parsedDataProfile) {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Roles Account doesn't exist or has been deleted!",
    });
  }

  await Role.destroy({
    where: { id },
  });

  return res.status(200).json({
    code: 200,
    status: true,
    msg: "Delete Data Role Successfully",
    data: dataBefore,
  });
};

export const RegisterRole = async (req, res) => {
  const { role } = req.body;

  try {
    const type = await Role.create({
      role,
    });
    res.status(200).json({
      code: 200,
      status: true,
      msg: "Register Data Role berhasil",
      data: type,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getDataRole = async (req, res) => {
  try {
    const type = await Role.findAll();
    res.status(200).json({
      code: 200,
      status: true,
      msg: "This Data All Role",
      data: type,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getDataRoleId = async (req, res) => {
  const { id } = req.params;
  try {
    const type = await Role.findOne({
      where: { id: id },
    });
    if (!type) {
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
      data: type,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateDataRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const data_before = await Role.findOne({
      where: { id },
    });

    if (!data_before) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Type Stuffs doesn't exist or has been deleted!",
      });
    }

    await Role.update(
      {
        role,
      },
      {
        where: { id },
      }
    );

    const data_update = await Role.findOne({
      where: { id },
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Role Success Updated",
      data: { data_before, data_update },
    });
  } catch (error) {
    console.log(error);
  }
};
