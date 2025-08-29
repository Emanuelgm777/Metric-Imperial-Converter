'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');

const apiRoutes = require('./routes/api.js');

const app = express();
module.exports = app;

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ✅ MONTA /api/convert ANTES QUE NADA
apiRoutes(app);

// ✅ Runner FCC SOLO si está habilitado por env var
if (process.env.FCC_RUNNER === 'true') {
  const apiTestRoutes = require('./routes/_api.js'); // expone /_api/get-tests, /_api/health
  apiTestRoutes(app);
}

app.use((req, res) => {
  res.status(404).type('text').send('Not Found');
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  const listener = app.listen(port, () => {
    const addr = listener.address();
    console.log('Server running on port ' + (addr && addr.port ? addr.port : port));
  });
}
