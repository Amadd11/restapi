const express = require("express");
const fs = require("fs"); // Built-in untuk file
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static("public")); // Serve static files kalau ada (opsional, untuk CSS/JS tambahan)

// Data file
const dataFile = path.join(__dirname, "data.json");

// Load data dari file saat start
let students = [];
if (fs.existsSync(dataFile)) {
  try {
    students = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch (err) {
    console.error("Error loading data:", err);
    students = [];
  }
}

// Save data ke file setelah setiap operasi
const saveData = () => {
  fs.writeFileSync(dataFile, JSON.stringify(students, null, 2), "utf8");
};

// GET /api/students
app.get("/api/students", (req, res) => {
  res.json({
    success: true,
    data: students,
    message: "Daftar siswa berhasil diambil",
    count: students.length,
  });
});

// POST /api/students
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
  saveData(); // Simpan ke file
  res.status(201).json({
    success: true,
    data: newStudent,
    message: "Siswa baru berhasil ditambahkan",
  });
});

// GET /api/students/:id
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

// PUT /api/students/:id
app.put("/api/students/:id", (req, res) => {
  const index = students.findIndex((s) => s.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: "Siswa tidak ditemukan",
    });
  }
  students[index] = { ...students[index], ...req.body };
  saveData(); // Simpan ke file
  res.json({
    success: true,
    data: students[index],
    message: "Siswa berhasil diupdate",
  });
});

// DELETE /api/students/:id
app.delete("/api/students/:id", (req, res) => {
  const initialLength = students.length;
  students = students.filter((s) => s.id != req.params.id);
  if (students.length === initialLength) {
    return res.status(404).json({
      success: false,
      error: "Siswa tidak ditemukan",
    });
  }
  saveData(); // Simpan ke file
  res.json({
    success: true,
    message: "Data siswa berhasil dihapus",
  });
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
