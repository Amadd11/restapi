const express = require("express");
const app = express();

app.use(express.json());

let students = []; // in-memory data

app.get("/api/students", (req, res) => {
  res.json(students);
});

app.post("/api/students", (req, res) => {
  const { nama, nis, email, kelas, umur } = req.body;
  const newStudent = { id: Date.now(), nama, nis, email, kelas, umur };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

app.get("/api/students/:id", (req, res) => {
  const student = students.find((s) => s.id == req.params.id);
  if (!student) return res.status(404).json({ message: "Not found" });
  res.json(student);
});

app.put("/api/students/:id", (req, res) => {
  const index = students.findIndex((s) => s.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });

  students[index] = { ...students[index], ...req.body };
  res.json(students[index]);
});

app.delete("/api/students/:id", (req, res) => {
  students = students.filter((s) => s.id != req.params.id);
  res.json({ message: "Data deleted" });
});


// ✅ Ganti dengan ini:
module.exports = app;
