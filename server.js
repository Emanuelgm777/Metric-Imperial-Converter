'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');

// Rutas
const apiRoutes = require('./routes/api.js');

// App
const app = express();

// Middleware básico
app.use(cors({ optionsSuccessStatus: 200 })); // FCC tests friendly
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir estáticos (index.html y /public si existen)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Ruta raíz (sirve index.html del boilerplate si está presente)
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API
apiRoutes(app);

// 404
app.use(function (req, res) {
  res.status(404).type('text').send('Not Found');
});

// Exportar app para los tests
module.exports = app;

// Levantar servidor sólo si se ejecuta directamente (no en tests)
if (require.main === module) {
  const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port ' + listener.address().port);
  });
}
