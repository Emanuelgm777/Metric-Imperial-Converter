'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');

const apiRoutes = require('./routes/api.js');
const fccTesting = require('./routes/fcctesting.js'); // rutas FCC oficiales

const app = express();
module.exports = app;

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// 1) Tu API primero
apiRoutes(app);

// 2) Monta SIEMPRE las rutas FCC oficiales (ellas mismas chequean NODE_ENV)
fccTesting(app);

// 3) Si además tenías routes/_api.js personal, móntalo solo si FCC_RUNNER=true
if (process.env.FCC_RUNNER === 'true') {
  try {
    const apiTestRoutes = require('./routes/_api.js');
    apiTestRoutes(app);
  } catch { /* opcional */ }
}

// 404
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
