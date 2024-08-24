import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  deleteUser,
  getDataUser,
  getDataUserId,
  getEmailUser,
  Login,
  Logout,
  refreshToken,
  RegisterUser,
  updateDataUser,
  whoAmI,
} from "../controllers/HandlerUsers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { Dashboard, handleGetRoot } from "../controllers/HandlerAction.js";
import {
  deleteStuff,
  getDataStuff,
  getDataStuffBy,
  getDataStuffId,
  RegisterStuff,
  updateDataStuff,
} from "../controllers/HandlerStuff.js";
import {
  deleteTypeStuff,
  getDataTypeStuff,
  getDataTypeStuffId,
  RegisterTypeStuff,
  updateDataTypeStuff,
} from "../controllers/HandlerType.js";
import {
  deleteRole,
  getDataRole,
  getDataRoleId,
  RegisterRole,
  updateDataRole,
} from "../controllers/HandlerRole.js";
export const router = express.Router();

export const prefix = "/v1/api/";

//UPLOUAD IMAGE
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/image");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Multer upload configuration
const upload = multer({ storage });

// Last Uploud

//ROUTE GENERAL
router.get(prefix, handleGetRoot);
router.get(prefix + "profile", verifyToken, whoAmI);
router.post(prefix + "login", Login);
router.delete(prefix + "logout", verifyToken, Logout);
router.get(prefix + "dashboard", verifyToken, Dashboard);
router.post(prefix + "refreshToken", verifyToken, refreshToken);

//ROUTE USER
router.get(prefix + "email", verifyToken, getEmailUser);
router.get(prefix + "user", verifyToken, getDataUser);
router.get(prefix + "user/:id", verifyToken, getDataUserId);
router.put(prefix + "user/update/:id", verifyToken, updateDataUser);
router.delete(prefix + "user/delete/:id", verifyToken, deleteUser);
router.post(prefix + "register", verifyToken, RegisterUser);

//ROUTE STUFF
router.get(prefix + "stuff", getDataStuff);
router.get(prefix + "stuff/search/:search", getDataStuffBy);
router.get(prefix + "stuff/:id", verifyToken, getDataStuffId);
router.post(
  prefix + "stuff/add",
  verifyToken,
  upload.single("image"),
  RegisterStuff
);
router.put(
  prefix + "stuff/update/:id",
  verifyToken,
  upload.single("image"),
  updateDataStuff
);
router.delete(prefix + "stuff/delete/:id", verifyToken, deleteStuff);

//ROUTE TYPE
router.get(prefix + "type", verifyToken, getDataTypeStuff);
router.get(prefix + "type/:id", verifyToken, getDataTypeStuffId);
router.post(prefix + "type/add", verifyToken, RegisterTypeStuff);
router.put(prefix + "type/update/:id", verifyToken, updateDataTypeStuff);
router.delete(prefix + "type/delete/:id", verifyToken, deleteTypeStuff);

//ROUTE ROLE
router.get(prefix + "role", verifyToken, getDataRole);
router.get(prefix + "role/:id", verifyToken, getDataRoleId);
router.post(prefix + "role/add", verifyToken, RegisterRole);
router.put(prefix + "role/update/:id", verifyToken, updateDataRole);
router.delete(prefix + "role/delete/:id", verifyToken, deleteRole);

export default router;
