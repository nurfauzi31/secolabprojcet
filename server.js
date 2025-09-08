const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Sajikan file HTML dari root

const siswaRoutes = require('./routes/siswaRoutes');
app.use('/api/siswa', siswaRoutes);

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});