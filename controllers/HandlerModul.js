import db from "../models/index.js";

const Modul = db.tbl_modul;
const Reference = db.tbl_reference;
const Readviews = db.tbl_readviews;
const Guru = db.tbl_guru;
const Siswa = db.tbl_siswa;
const Class = db.tbl_class;
const ModulContent = db.tbl_modul_content;

export const getDataModul = async (req, res) => {
  try {
    const { role_id, userId } = req.user;
    let whereClause = {};

    // Menentukan whereClause berdasarkan role_id
    if (role_id == 2) {
      whereClause = { id_guru: userId };
    }

    // Ambil semua data modul termasuk data referensi yang terkait
    const modul = await Modul.findAll({
      where: whereClause,
      include: [
        { model: ModulContent, as: "content_modul" },
        { model: Reference, as: "referensi" },
        { model: Readviews, as: "views" },
        { model: Guru, as: "publisher" },
      ],
    });

    // Cek apakah data modul ditemukan
    if (!modul || modul.length === 0) {
      return res.status(404).json({
        code: 404,
        status: false,
        msg: "Data doesn't exist",
      });
    }

    // Kirimkan data modul jika ditemukan
    res.status(200).json({
      code: 200,
      status: true,
      msg: "Data found",
      data: modul,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      code: 500,
      status: false,
      msg: "Internal server error",
    });
  }
};

export const getDataModulForSiswa = async (req, res) => {
  try {
    // Ambil semua data modul termasuk data referensi yang terkait
    const siswa = await Siswa.findOne({
      where: { id: req.user.userId },
      include: { model: Class, as: "kelas" },
    });
    const modul = await Modul.findAll({
      where: { for_class: siswa.kelas.grade_class },
      include: [
        { model: Reference, as: "referensi" },
        { model: Readviews, as: "views" },
        { model: Guru, as: "publisher" },
      ], // 'referensi' harus dalam tanda kutip
    });

    // Cek apakah data modul ditemukan
    if (!modul || modul.length === 0) {
      return res.status(404).json({
        code: 404,
        status: false,
        msg: "Data doesn't exist",
      });
    }

    // Kirimkan data modul jika ditemukan
    res.status(200).json({
      code: 200,
      status: true,
      msg: "Data found",
      data: modul,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      code: 500,
      status: false,
      msg: "Internal server error",
    });
  }
};

export const getDataModulById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ambil data modul berdasarkan ID
    const modul = await Modul.findOne({
      include: [
        { model: content_modul, as: "publisher" },
        { model: Reference, as: "referensi" },
        { model: Readviews, as: "views", where: { id_modul: id } },
        { model: Guru, as: "publisher" },
      ], // 'referensi' harus dalam tanda kutip
    });

    // Cek apakah data modul ditemukan
    if (!modul) {
      return res.status(404).json({
        code: 404,
        status: false,
        msg: "Data doesn't exist",
      });
    }

    // Kirimkan data modul jika ditemukan
    res.status(200).json({
      code: 200,
      status: true,
      msg: "Data found",
      data: modul,
    });
  } catch (error) {
    console.error("Error fetching data by ID:", error);
    return res.status(500).json({
      code: 500,
      status: false,
      msg: "Internal server error",
    });
  }
};

export const deleteStuff = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari data modul berdasarkan ID
    const modul = await Modul.findOne({ where: { id } });

    // Jika modul tidak ditemukan, kirimkan respons error
    if (!modul) {
      return res.status(404).json({
        code: 404,
        status: false,
        msg: "Modul doesn't exist or has been deleted!",
      });
    }

    // Hapus data modul berdasarkan ID
    await Modul.destroy({ where: { id } });

    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Modul deleted successfully",
      data: modul, // Mengirimkan data modul yang dihapus sebagai respons
    });
  } catch (error) {
    console.error("Error while deleting modul:", error);
    return res.status(500).json({
      code: 500,
      status: false,
      msg: "Internal server error",
    });
  }
};

export const createModul = async (req, res) => {
  // Extract title, content, and for_class from request body
  const { title, content, for_class } = req.body;

  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Validate input
  if (!title || !content) {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Required fields are missing",
    });
  }

  try {
    // Create new module with uploaded file path
    const newModul = await Modul.create({
      id_guru: req.user.userId,
      title,
      content,
      for_class,
      status_post: "Active",
      image: `http://localhost:8000/image/${req.file.filename}`, // Save the image path
    });

    // Send response with status 201 Created
    res.status(201).json({
      code: 201,
      status: true,
      msg: "Create New Modul Success",
      data: newModul,
    });
  } catch (error) {
    console.error("Error while creating new module:", error);

    // Send response with status 500 Internal Server Error
    res.status(500).json({
      code: 500,
      status: false,
      msg: "Internal server error",
    });
  }
};

export const updateDataModul = async (req, res) => {
  const { id } = req.params;
  const { title, content, status_post, for_class } = req.body;

  // Validasi input
  if (!title || !content) {
    return res.status(400).json({
      code: 400,
      status: false,
      msg: "Required fields are missing",
    });
  }

  try {
    // Cari data modul sebelum pembaruan
    const data_before = await Modul.findOne({
      where: { id },
    });

    // Jika data modul tidak ditemukan
    if (!data_before) {
      return res.status(404).json({
        code: 404,
        status: false,
        msg: "Modul tidak ditemukan atau sudah dihapus!",
      });
    }

    // Perbarui data modul
    await Modul.update(
      {
        title,
        content,
        for_class,
        status_post,
        image: `http://localhost:8000/image/${req.file.filename}`, // Save the image path
      },
      {
        where: { id },
      }
    );

    // Cari data modul setelah pembaruan
    const data_update = await Modul.findOne({
      where: { id },
    });

    // Berikan respons berhasil
    return res.status(200).json({
      code: 200,
      status: true,
      msg: "Data modul berhasil diperbarui",
      data: { data_before, data_update },
    });
  } catch (error) {
    console.error("Kesalahan saat memperbarui data modul:", error);

    // Berikan respons kesalahan server
    return res.status(500).json({
      code: 500,
      status: false,
      msg: "Terjadi kesalahan pada server",
    });
  }
};
