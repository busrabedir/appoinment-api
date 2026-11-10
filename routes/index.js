const express = require("express");
const {
  getAllAppointments,
  getAllAppointmentByDoctor,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentDetail,
} = require("../controllers/index");

// Router > server.js dosyası dışarısında route tanımlamaya yarar

const router = express.Router();

// randevuları al
router.get("/api/appointments", getAllAppointments);

// doktora ait randevuları al
router.get("/api/appointments/doctor/:doctor", getAllAppointmentByDoctor);

// bir randevu detayını al
router.get("/api/appointments/:id", getAppointmentDetail);

// yeni randevu oluştur
router.post("/api/appointments", createAppointment);

// randevuyu güncelle
router.patch("/api/appointments/:id", updateAppointment);

// randevuyu sil
router.delete("/api/appointments/:id", deleteAppointment);

// server.js'e router'u tanıtmak için export et
module.exports = router;
