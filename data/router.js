const express = require('express');

const db = require('./db');

const router = express.Router();

router.get('/', (req, res) => {
    db.find(req.query)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        console.log(error.message);
        res.status(500).json({
            message: 'Error retrieving the posts',
        })
    })
})

router.get('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    })
})

router.post('/', (req, res) => {
    db.insert(req.body)
    .then(post => {
        if(req.body.title && req.body.contents) {
            req.body
            res.status(201).json(post);
        } else {
            console.log(post)
            res.status(400).json({
                errorMessage: "Please provide title and contents for the post."
            })
        }
        
    }) 
    .catch(error => {
        console.error(error.message);
        res.status(500).json({
            error: "there was an error while saving the post to the database"
        })
    })
})

router.delete('/:id', (req, res) => {
    db.remove(req.params.id)
    .then(count => {
        if (count > 0) {
            req.params
            res.status(200).json({ message: 'The post has been successfully deleted' })
        } else {
            res.status(404).json({ message: 'Could not find post' })
        }
    })
    .catch(error => {
        console.error(error.message)
        res.status(500).json({
            message: 'Could not remove the post'
        })
    })
})

router.put('/:id', (req, res) => {
    const changes = req.body;
    db.update(req.params.id, changes)
    .then(post => {
        if (post) {
            db.findById(req.params.id).then(post => {
                res.status(200).json(post);
            }).catch(err => {
                res.status(500).json({ errorMessage: "could not read updated message" })
            })
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Could not find message' })
        }
    })
    .catch(error => {
        console.error(error.message);
        res.status(500).json({
            errorMessage: 'Error updating the message'
        })
    })
})

router.get('/:id/comments', (req, res) => {
    console.log(req.params.id)
    console.log(req)
    db.findPostComments(req.params.id).then(comments => {
        console.log(comments)
        res.status(200).json(comments)
    })
    .catch(err => {
        res.status(500).json({ errorMessage: 'Could not find comment' })
    })
})

router.post('/:id/comments', (req, res) => {
    console.log(req.body)
    db.findPostComments(req.params.id)
        .then(post => {
            if(post) {
                db.insertComment(req.body)
                    .then(comment => {
                        if(req.body.text) {
                            res.status(201).json(comment)
                        } else {
                            res.status(400).json({ message: 'Please provide text for the comment' })
                        }
                    })
                    .catch(err => {
                        console.log(err.message)
                        res.status(500).json({ errorMessage: 'error adding comment' })
                    })
            } else {
                res.status(404).json({ message: "post not found" })
            }
        })
        .catch(err => {
            console.log(err.message)
            res.status(500).json({ errorMessage: 'error finding comment' })
        })
})

module.exports = router;