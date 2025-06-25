const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const events = [];

const services = [
  'http://posts-clusterip-srv:4000/events'
  // ,
  // 'http://localhost:4001/events',
  // 'http://localhost:4002/events',
  // 'http://localhost:4003/events'
];

app.post('/events', async (req, res) => {
  const event = req.body;
  events.push(event); 

  for (let service of services) {
    try {
      await axios.post(service, event);
    } catch (err) {
      console.log(`Could not send event to ${service}:`, err.message);
    }
  }

  res.status(200).send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("📨 Event Bus listening on 4005");
});
