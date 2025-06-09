const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {}

app.get('/posts', (req, res) => {
    res.send(posts)
});

app.post('/events', (req, res) => {
    const {type, data} = req.body

    if (type === 'PostCreated'){
        const {id, title} = data

        posts[id] = {id, title, comments: []}
    }

    if (type === 'CommentCreated'){
        const {id, content, postId} = data

        const post = posts[postId]

        if (!post) {
            console.warn(`⚠️ Comment for non-existing postId: ${postId}`);
            return res.send({});
        }

        post.comments.push({id, content});
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

    console.log(posts)
 
    res.send({})
});

app.listen(4002, async () => {
    console.log("Listening on Port 4002");

    try {
        const res = await axios.get('http://localhost:4005/events');

        for (let event of res.data) {
            const { type, data } = event;

            if (type === 'PostCreated') {
                const { id, title } = data;
                posts[id] = { id, title, comments: [] };
            }

            if (type === 'CommentCreated') {
                const { id, content, postId } = data;
                const post = posts[postId];
                if (post) {
                    post.comments.push({ id, content });
                }
            }
            
            if (type === 'PostDeleted') {
            delete posts[data.id];
            }

            if (type === 'CommentDeleted') {
            const { postId, id } = data;
            const post = posts[postId];
            if (post) {
                post.comments = post.comments.filter(c => c.id !== id);
            }
            }

        }

        console.log("✅ Events replayed and state rebuilt.");
    } catch (err) {
        console.error('Error fetching past events:', err.message);
    }
});