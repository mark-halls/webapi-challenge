const express = require(`express`);

const actionsDb = require(`../../../data/helpers/actionModel`);

const router = express.Router();

router.use(express.json());


// get actions
router.get(`/:id`, (req, res) => {});

// add new action
router.post(`/`, (req, res) => {});

// update action
router.put(`/:id`, (req, res) => {});

// delete action
router.delete(`/:id`, (req, res) => {});
