// const mongoose = require('mongoose')
// mongoose.Promise = global.Promise
const express = require('express')

const passport = require('passport')

const router = express.Router()
// require book models
const Movie = require('./../models/movie.js')

const customErrors = require('./../../lib/custom_errors')

const handle404 = require('../../lib/custom_errors')

const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', {session: false})

// movie create route
// CREATE
// POST /movies/
router.post('/movies', requireToken, (req, res, next) => {
  // get the data from the request object ?
  req.body.movie.owner = req.user.id
  Movie.create(req.body.movie)
    .then(movie => {
      res.status(201).json({movie: movie.toObject()})
    })
    .catch(next)
})

// INDEX
// GET /movies
router.get('/movies', requireToken, (req, res, next) => {
  Movie.find()
    .then(movies => {
      return movies.map(movie => movie.toObject())
    })
    .then(movies => res.status(200).json({ movies: movies }))
    .catch(next)
})

// SHOW
// GET /movies/:id
router.get('/movies/:id', requireToken, (req, res, next) => {
  Movie.findById(req.params.id)
    .then(handle404)
    .then(movie => res.status(200).json({ movie: movie.toObject() }))
    .catch(next)
})

// UPDATE
// PATCH /movies/:id
router.patch('/movies/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.movie.owner
  // console.log(req)
  Movie.findById(req.params.id)
    .then(handle404)
    .then(movie => {
      requireOwnership(req, movie)

      return movie.updateOne(req.body.movie)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /movies/:id
router.delete('/movies/:id', requireToken, (req, res, next) => {
  Movie.findById(req.params.id)
    .then(handle404)
    .then(movie => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, movie)
      // delete the example ONLY IF the above didn't throw
      movie.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
