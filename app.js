const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const port = 5000
var admin = require("firebase-admin");
app.use(express.json())
const { body, validationResult } = require('express-validator');


var serviceAccount = require("./kat-console-firebase-adminsdk-i1gh5-f453d28f45.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

var db = admin.firestore();

app.get('/', (req, res) => {
  res.json({ "message": "Server is running :D" });
})

app.get('/cats', async (req, res) => {
  const catsRef = db.collection('cats');
  const snapshot = await catsRef.get();
  res.status(200).json(snapshot.docs);
})

app.post('/cat/create',
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const data = {
      name: req.body.name,
      type: req.body.type,
      image: req.body.image
    };
    // Add a new document in collection "cities" with ID 'LA'
    const response = await db.collection('cats').add(data);
    res.status(200).json({
      "message": "Cat successfully added:D",
      "id": response.id
    }
    );
  })

app.put('/cat/:catId', async (req, res) => {
  const catRef = db.collection('cats').doc(req.params.catId);

  const response = await catRef.set(
    req.body
    , { merge: true });

  res.status(200).json({
    "message": "Cat successfully updated:D",
    "id": response.id
  }
  );
})

app.delete('/cat/:catId', async (req, res) => {
  const catRef = db.collection('cats').doc(req.params.catId);

  const response = await catRef.delete();

  res.status(200).json({
    "message": "Cat successfully deleted:D",
    "id": response.id
  }
  );
})

app.listen(port, () => {
  console.log(`Cat API listening on port ${port}`)
})