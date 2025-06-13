const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()

app.use(bodyParser.json())

const bannedWords = ['hate', 'stupid', 'kill', 'ugly', 'racist', 'dumb'];

app.post('/events', async(req, res) => {
    const {type, data} = req.body


    if (type === 'CommentCreated') {
        const isBanned = bannedWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(data.content));
        const status = isBanned ? 'rejected' : 'approved';


    console.log(
      `Moderated comment "${data.content}" – status: ${status.toUpperCase()}`
    );

        await axios.post('http://localhost:4005/events', {
            type : 'CommentModerated',
            data: {
                id : data.id,
                postId : data.postId,
                status,
                content: data.content
            }
        });
    }

    res.send({})
});


app.listen(4003, () =>{
    console.log("Running on port 4003")
}); 