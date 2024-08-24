import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

const User = db.tbl_user;
const Role = db.tbl_role;

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.sendStatus(401);
    }

    const user = await User.findOne({
      where: {
        refreshtoken: refreshToken,
      },
    });

    if (!user) {
      return res.sendStatus(403);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.sendStatus(403);
        }

        const { role_id, name, email } = user;
        const accessToken = jwt.sign(
          { userId: role_id, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "30s",
          }
        );

        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

export const whoAmI = async (req, res) => {
  try {
    const currentUser = req.user;
    res.status(200).json({
      code: 200,
      status: true,
      msg: "This data Users Login Now",
      data: currentUser,
    });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: false,
        msg: "Email not found",
      });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Incorrect password",
      });
    }

    const { id, name_user, sex, role_id, email } = user;

    const accessToken = jwt.sign(
      { id, name_user, sex, email, role_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { id, name_user, sex, email, role_id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await User.update(
      { refreshtoken: refreshToken, accesstoken: accessToken },
      { where: { id } } // Use id directly without indexing
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "Lax",
    });

    res.status(200).json({
      code: 200,
      msg: "Login successful",
      accessToken,
    });
  } catch (error) {
    console.error("System failure:", error);
    res.status(500).json({
      code: 500,
      status: false,
      msg: "System failure",
    });
  }
};

export const getEmailUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    res.status(200).json({
      code: 200,
      status: true,
      msg: "data you searched Found",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(200).json({
        code: 200,
        status: false,
        msg: "User has been logged out",
      });
    }

    const user = await User.findOne({
      where: {
        refreshtoken: refreshToken,
      },
    });

    if (!user) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "User not found",
      });
    }


    await User.update(
      { refreshtoken: null },
      {
        where: {
          id: user.id,
        },
      }
    );

    res.clearCookie("refreshToken");

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "You have been logged out",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      status: false,
      msg: "Internal Server Error",
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const dataBefore = await User.findOne({
    where: { id },
  });
  const parsedDataProfile = JSON.parse(JSON.stringify(dataBefore));

  if (!parsedDataProfile) {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Users Account doesn't exist or has been deleted!",
    });
  }

  await User.destroy({
    where: { id },
  });

  return res.status(200).json({
    code: 200,
    status: true,
    msg: "Delete Data User Successfully",
    data: dataBefore,
  });
};

export const RegisterUser = async (req, res) => {
  const { name_user, sex, email, password, role_id } = req.body;

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database
    const newUser = await User.create({
      name_user,
      sex,
      email,
      password: hashPassword,
      real_password: password,
      role_id,
    });

    // Respond with success
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "User registration successful",
      data: newUser,
    });
  } catch (error) {
    console.error("Error during user registration:", error);

    // Respond with an error message
    return res.status(500).json({
      code: 500,
      status: false,
      msg: "Failed to register user",
      error: error.message,
    });
  }
};

export const getDataUser = async (req, res) => {
  try {
    const user = await User.findAll({
      include: {
        model: Role,
        as: "role",
      },
    });
    res.status(200).json({
      code: 200,
      status: true,
      msg: "This Data All User",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getDataUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { id: id },
    });
    if (!user) {
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
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateDataUser = async (req, res) => {
  const { id } = req.params;
  const { name_user, sex, email, password, role_id } = req.body;

  try {
    const data_before = await User.findOne({
      where: { id },
    });

    if (data_before == null) {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Users doesn't exist or has been deleted!",
      });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await User.update(
      {
        name_user,
        sex,
        email,
        password: hashPassword,
        real_password: password,
        role_id,
      },
      {
        where: { id },
      }
    );

    const data_update = await User.findOne({
      where: { id },
    });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Users Success Updated",
      data: { data_before, data_update },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getDataUserBy = async (req, res) => {
  try {
    const { search } = req.params;
    let user = await User.findAll({
      where: {
        [Op.or]: [{ name_user: { [Op.like]: `%` + search + `%` } }],
      },
    });
    if (user == "") {
      return res.status(400).json({
        code: 400,
        status: false,
        msg: "Data User Doesn't Existing",
      });
    }
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "data user you searched Found",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};
