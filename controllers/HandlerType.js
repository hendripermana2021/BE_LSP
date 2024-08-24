import db from "../models/index.js";
import { Op } from "sequelize";

const User = db.tbl_user;
const Stuff = db.tbl_stuff;
const Type_Stuff = db.tbl_type_stuff;

export const deleteTypeStuff = async (req, res) => {
    const { id } = req.params;
    const dataBefore = await Type_Stuff.findOne({
      where: { id },
    });
    const parsedDataProfile = JSON.parse(JSON.stringify(dataBefore));
  
    if (!parsedDataProfile) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Type_Stuffs Account doesn't exist or has been deleted!",
      });
    }
  
    await Type_Stuff.destroy({
      where: { id },
    });
  
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Delete Data Type_Stuff Successfully",
      data: dataBefore,
    });
  };
  
  export const RegisterTypeStuff = async (req, res) => {
    const { name_type } = req.body;
  
    try {
      const type = await Type_Stuff.create({
        name_type
      });
      res.status(200).json({
        code: 200,
        status: true,
        msg: "Register Data Stuff berhasil",
        data: type,
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  export const getDataTypeStuff = async (req, res) => {
    try {
      const type = await Type_Stuff.findAll();
      res.status(200).json({
        code: 200,
        status: true,
        msg: "This Data All Stuff",
        data: type,
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  export const getDataTypeStuffId = async (req, res) => {
    const { id } = req.params;
    try {
      const type = await Type_Stuff.findOne({
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
  
  export const updateDataTypeStuff = async (req, res) => {
    const { id } = req.params;
    const { name_type } = req.body;
  
    try {
      const data_before = await Type_Stuff.findOne({
        where: { id },
      });
  
      if (!data_before) {
        return res.status(400).json({
          code: 400,
          status: false,
          msg: "Type Stuffs doesn't exist or has been deleted!",
        });
      }
  
      await Type_Stuff.update(
        {
            name_type
        },
        {
          where: { id },
        }
      );
  
      const data_update = await Type_Stuff.findOne({
        where: { id },
      });
  
      return res.status(200).json({
        code: 200,
        status: true,
        msg: "Type Stuff Success Updated",
        data: { data_before, data_update },
      });
    } catch (error) {
      console.log(error);
    }
  };