
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const PORT = 3050;

function enableCors(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}

function ignoreFavicon(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    return res.sendStatus(204);
  }
  next();
}

app.use(enableCors);
app.use(ignoreFavicon);

app.use((req, res, next) => {
  console.log('req.path = ', req.path);
  next();
});

// app.use((req, res, next) => {
//   setTimeout(next, 3000);
// });

function isUserLoggedIn() {
  const fsData = fs.readFileSync(
    path.resolve(__dirname, 'data', 'current_user.json'),
    {
      encoding: 'utf-8',
      flag: 'r'
    }
  );
  console.log('fsData = ', fsData);
  return !!fsData;
}

app.get('/users', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'data/users.json'));
});

app.get('/admins', (req, res) => {
  if (!isUserLoggedIn())
  {
    return res.status(403).end();
  }
  res.sendFile(path.resolve(__dirname, 'data/admins.json'));
});

app.get('/current_user', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'data/current_user.json'));
});

app.get('/logout', (req, res) => {
  fs.writeFileSync(
    path.resolve(__dirname, 'data', 'current_user.json'),
    'false'
  );

  res.send(true);
});

app.get('/login', (req, res) => {
  fs.writeFileSync(
    path.resolve(__dirname, 'data', 'current_user.json'),
    'true'
  );

  res.send(true);
});

// app.all('/api/*', (req, res) => {

//   // console.log('req = ', req.path);

//   const dataFile = req.params[0].split('/').pop();
//   if (dataFile) {
//     setTimeout(() => {
//       res.sendFile(path.join(__dirname, 'data', `${dataFile}.json`));
//     }, 1000);
//   }
// });

app.listen(PORT, () => {
  console.log('Listening on port = ', PORT);
});
