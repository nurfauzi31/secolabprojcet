const db = require('../config/db');
exports.getAllSiswa = (req, res) => {
    const query = `
        SELECT s.id_siswa, s.nama_siswa, k.nama_kelas as 'class', s.gaya_belajar as style, s.kecepatan_belajar as speed, AVG(n.skor) as grade
        FROM Siswa s
        LEFT JOIN Kelas k ON s.id_kelas = k.id_kelas
        LEFT JOIN Nilai n ON s.id_siswa = n.id_siswa
        GROUP BY s.id_siswa
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        // Membersihkan nilai null jika ada siswa tanpa nilai
        const cleanedResults = results.map(student => ({
            ...student,
            grade: student.grade ? Math.round(student.grade) : 70 // default grade if null
        }));
        res.json(cleanedResults);
    });
};