const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {}

const handleEvent = (type, data) => {
    if (type === 'PostCreated'){
        const {id, title} = data

        posts[id] = {id, title, comments: []}
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status} = data;
        const post = posts[postId];

        if (!post) {
            console.warn(`⚠️ Comment for non-existing postId: ${postId}`);
            return res.send({});
        }

        const alreadyExists = post.comments.some(c => c.id === id);
        if (!alreadyExists) {
            post.comments.push({ id, content, status});
        }
    }
    

    if (type === 'CommentUpdated'){
        const {id, status, postId, content} = data
        const post = posts[postId]

        const comment = post.comments.find(comment =>{
            return comment.id === id;
        });
        comment.status = status
        comment.content = content
    }

    if (type === 'PostDeleted') {
    delete posts[data.id];
    }

    if (type === 'CommentDeleted') {
        const { postId, id } = data;
        const post = posts[postId];

        if (post) {
            post.comments = post.comments.filter((c) => c.id !== id);
        }
    }    
}

app.get('/posts', (req, res) => {
    res.send(posts)
});

app.post('/events', (req, res) => {
    const {type, data} = req.body

    handleEvent(type, data);
    console.log(posts)
 
    res.send({})
});

app.listen(4002, async () => {
    console.log("Listening on Port 4002");

    try {
        const res = await axios.get('http://event-bus-srv:4005/events');

        for (let event of res.data) {
            handleEvent(event.type, event.data);
        }

        console.log("Events replayed and state rebuilt. ✅ ");
    } catch (err) {
        console.error('Error fetching past events:', err.message);
    }
});