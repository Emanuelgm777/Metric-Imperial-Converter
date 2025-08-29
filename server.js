'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');

// Rutas
const apiRoutes = require('./routes/api.js');
const apiTestRoutes = require('./routes/_api.js'); // runner FCC (/_api/*)

const app = express();

// Exporta app de inmediato (rompe ciclos)
module.exports = app;

// Middlewares
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Estáticos + vista
app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ✅ 1) Monta tu API primero
apiRoutes(app);

// ✅ 2) Luego monta el runner (se programará en el siguiente tick)
apiTestRoutes(app);

// 404
app.use((req, res) => {
  res.status(404).type('text').send('Not Found');
});

// Levantar sólo si es entrypoint
if (require.main === module) {
  const port = process.env.PORT || 3000;
  const listener = app.listen(port, () => {
    try {
      const addr = listener.address();
      console.log('Server running on port ' + (addr && addr.port ? addr.port : port));
    } catch {
      console.log('Server running on port ' + port);
    }
  });
}
