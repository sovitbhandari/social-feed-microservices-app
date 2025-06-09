const express = require('express');
const bodyParser = require('body-parser')
const {randomBytes} = require('crypto');
const cors = require('cors')
const axios = require('axios')

const app = express();
app.use(bodyParser.json());
app.use(cors())

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) =>{
    const id = randomBytes(4).toString('hex')
    const {title} = req.body;

    posts[id] = { id, title };

    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data:{ id, title }
    });
    res.status(201).send(posts[id]);
});

app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  if (posts[id]) delete posts[id];

  await axios.post('http://localhost:4005/events', {
    type: 'PostDeleted',
    data: { id }
  });
  res.status(204).send();
});


app.post('/events', (req, res) => {
    console.log("Received Event", req.body.type)
    res.send({});
});

app.listen(4000, () => {
    console.log('Listening on 4000');
})