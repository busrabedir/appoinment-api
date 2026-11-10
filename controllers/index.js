const fs = require("fs");
const crypto = require("crypto");
const write = require("../utils/write");

// randevu verilerini json dosyasından al
let appointments = JSON.parse(fs.readFileSync(`${__dirname}/../data/db.json`, "utf-8"));

exports.getAllAppointments = (req, res) => {
  res.json({
    message: "Randevular listelendi",
    results: appointments.length,
    data: appointments,
  });
};

exports.getAllAppointmentByDoctor = (req, res) => {
  // url'de parametre olarak bulunan doktorun ismine eriş
  const { doctor } = req.params;

  // doktora ait olan randevuları al
  const filtered = appointments.filter((i) => i.doctor === doctor);

  // client'a cavap gönder
  res.json({
    message: "Doktora ait randevular listelendi",
    results: filtered.length,
    data: filtered,
  });
};

exports.getAppointmentDetail = (req, res) => {
  // url'den id parametresini al
  const { id } = req.params;

  // randevular arasından id ile eşleşeni bul
  const appointment = appointments.find((i) => i.id === id);

  // client'a cevap gönder
  res.json({ message: "Randevu detayları alındı", data: appointment });
};

exports.createAppointment = (req, res) => {
  // backendin oluşturması gereken verileri hazırla
  const id = crypto.randomUUID();
  const createdAt = new Date().getTime();
  const updatedAt = new Date().getTime();

  // Tarihi alıp milisaniyeye çevir
  const appointmentDate = new Date(req.body.date).getTime();

  // bodyden gelen verilerin arasına yukarıdaki verileri ekle
  const newAppointment = { ...req.body, date: appointmentDate, id, createdAt, updatedAt };

  // yeni randevuyu, randevular dizisine ekle
  appointments.push(newAppointment);

  // json dosyasını güncelle
  write(appointments);

  // client'a cevap gönder
  res.status(201).json({
    message: "Randevu oluşturuldu",
    newAppointment,
    data: newAppointment,
  });
};

exports.updateAppointment = (req, res) => {
  // güncellenicek randevu id'sini url parametresinden al
  const { id } = req.params;

  // id'sini bildiğimiz güncellenicek randevunun bütün verilerini al
  const index = appointments.findIndex((i) => i.id === id);

  // isteğin body kısmı ile gelen alanları randevu nesnesinde güncelle
  const updated = {
    ...appointments[index],
    ...req.body,
    updatedAt: new Date().getTime(),
  };

  // dizideki ilgili randevuyu güncelle
  appointments[index] = updated;

  // json dosyasını güncelle
  write(appointments);

  // client'a cevap gönder
  res.json({ message: "Randevu güncellendi", data: updated });
};

exports.deleteAppointment = (req, res) => {
  // silinecek randevunun id'sine eriş
  const { id } = req.params;

  // id'si bilinen randevuyu diziden kaldır
  appointments = appointments.filter((i) => i.id !== id);

  // json dosyasını güncelle
  write(appointments);

  // randevu kaldırıldı
  res.status(200).json({ message: "Randevu kaldırıldı" });
};
