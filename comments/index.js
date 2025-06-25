const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto')
const cors = require('cors')
const axios = require('axios')

const app = express();
app.use(cors())
app.use(bodyParser.json());

const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])
});

app.post('/posts/:id/comments', async(req, res) => {
    const commentId = randomBytes(4).toString('hex')
    const {content} = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({id: commentId, content, status : 'pending'});

    commentsByPostId[req.params.id] = comments;
    res.status(201).send(comments);

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
          id: commentId, 
          content, 
          postId : req.params.id,
          status: 'pending',
          timestamp: Date.now(),
        }
    })
});

app.delete('/posts/:postId/comments/:id', async (req, res) => {
  const { postId, id } = req.params;
  commentsByPostId[postId] =
    (commentsByPostId[postId] || []).filter(c => c.id !== id);

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentDeleted',
    data: { id, postId }
  });
  res.status(204).send();
});


app.post('/events', async(req, res) => {
    console.log("Received Event", req.body.type)

    const {type, data} = req.body

    if (type === 'CommentModerated'){
        const {postId, id, status, content} = data
        const comments = commentsByPostId[postId]

        const comment = comments.find(comment => {
            return comment.id === id
        });

        comment.status = status

        await axios.post('http://event-bus-srv:4005/events',{
            type : 'CommentUpdated', 
            data : {
                id,
                status,
                postId,
                content
            }
        })
    }

    res.send({});
});

app.listen(4001, (req, res) =>{
    console.log("listening on port 4001")
});