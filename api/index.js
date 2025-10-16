const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let students = [];

app.get("/api/students", (req, res) => {
  res.json({
    success: true,
    data: students,
    message: "Daftar siswa berhasil diambil",
    count: students.length,
  });
});

app.post("/api/students", (req, res) => {
  const { nama, nis, email, kelas, umur } = req.body;

  if (!nama || !nis) {
    return res.status(400).json({
      success: false,
      error: "Nama dan NIS wajib diisi",
    });
  }

  const newStudent = {
    id: Date.now(),
    nama,
    nis,
    email: email || null,
    kelas: kelas || null,
    umur: umur || null,
  };

  students.push(newStudent);

  res.status(201).json({
    success: true,
    data: newStudent,
    message: "Siswa baru berhasil ditambahkan",
  });
});

app.get("/api/students/:id", (req, res) => {
  const student = students.find((s) => s.id == req.params.id);
  if (!student) {
    return res.status(404).json({
      success: false,
      error: "Siswa tidak ditemukan",
    });
  }
  res.json({
    success: true,
    data: student,
    message: "Detail siswa berhasil diambil",
  });
});

app.put("/api/students/:id", (req, res) => {
  const index = students.findIndex((s) => s.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: "Siswa tidak ditemukan",
    });
  }

  students[index] = { ...students[index], ...req.body };

  res.json({
    success: true,
    data: students[index],
    message: "Siswa berhasil diupdate",
  });
});

app.delete("/api/students/:id", (req, res) => {
  const initialLength = students.length;
  students = students.filter((s) => s.id != req.params.id);

  if (students.length === initialLength) {
    return res.status(404).json({
      success: false,
      error: "Siswa tidak ditemukan",
    });
  }

  res.json({
    success: true,
    message: "Data siswa berhasil dihapus",
  });
});


module.exports = app;
