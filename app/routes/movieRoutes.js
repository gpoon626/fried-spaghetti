// const mongoose = require('mongoose')
// mongoose.Promise = global.Promise
const express = require('express')
const router = express.Router()
// require book models
const Movie = require('./../models/movie.js')
const handle404 = require('../../lib/custom_errors')

// movie create route
// CREATE
// POST /movies/
router.post('/movies', (req, res, next) => {
  // get the data from the request object ?
  const movieData = req.body.movie
  Movie.create(movieData)
    .then(movie => res.status(201).json({movie: movie}))
    .catch(next)
})

// INDEX
// GET /movies
router.get('/movies', (req, res, next) => {
  Movie.find()
    .populate('owner')
    .then(movie => res.json({movie: movie}))
    .catch(next)
})

// SHOW
// GET /movies/:id
router.get('/movies/:id', (req, res, next) => {
  const id = req.params.id
  Movie.findById(id)
    .populate('owner')
    .then(handle404)
    .then(movie => res.json({movie: movie}))
    .catch(next)
})

// UPDATE
// PATCH /movies/:id
router.patch('/movies/:id', (req, res, next) => {
  const id = req.params.id
  const movieData = req.body.movie
  Movie.findById(id)
    .then(handle404)
    .then(movie => movie.update(movieData))
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /movies/:id
router.delete('/movies/:id', (req, res, next) => {
  const id = req.params.id
  Movie.findById(id)
    .then(handle404)
    .then(movie => movie.remove())
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
