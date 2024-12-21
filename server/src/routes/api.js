const express = require('express');

const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');

const api = express.Router()

api.use('/planets', planetsRouter); // mounting the common part of the path over here
api.use('/launches', launchesRouter); 

module.exports = api;