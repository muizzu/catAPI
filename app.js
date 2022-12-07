const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const port = 5000
var admin = require("firebase-admin");
app.use(cors());
app.use(express.json())
const { param, check, body, validationResult } = require('express-validator');


var serviceAccount = require("./kat-console-firebase-adminsdk-i1gh5-f453d28f45.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

var db = admin.firestore();

//get all cats
app.get('/', (req, res) => {
  res.json({ "message": "Server is running :D" });
})

app.get('/cats', async (req, res) => {
  const catsRef = db.collection('cats');
  const snapshot = await catsRef.get();
  res.status(200).json(snapshot.docs);
})

//filter cat bread
app.post('/cats/filterBreed/:breed', async (req, res) => {
  const catsRef = db.collection('cats');
  const snapshot = await catsRef.where('type', '==', req.params.breed).get();
  if (snapshot.empty) {
    res.status(405).json({ status: 405, errors: "No matching documents." });
    return;
  }
  res.status(200).json(snapshot.docs);
})

//create cat
app.post('/cats/create',
  check('name').notEmpty(),
  check('type').notEmpty(),
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

//update data
app.put('/cats/:catId', body('name').notEmpty(), body('type').notEmpty(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const catRef = db.collection('cats').doc(req.params.catId);
    const response = await catRef.set(
      req.body
      , { merge: true });


    res.status(200).json({
      "message": "Cat successfully updated:D",
      "id": req.params.catId,
      "updated_at": response,
    }
    );
})


//delete cat
app.delete('/cats/:catId', async (req, res) => {
  const catRef = db.collection('cats').doc(req.params.catId);
  const doc = await catRef.get();
  if (doc.exists) {
    const response = await catRef.delete();

    res.status(200).json({
      "message": "Cat successfully deleted:D",
      "id": req.params.catId,
      "delete_at": response,
    }
    );
  } else {
    res.status(405).json({ status: 405, errors: "No matching documents." });
  }


})

app.listen(port, () => {
  console.log(`Cat API listening on port ${port}`)
})