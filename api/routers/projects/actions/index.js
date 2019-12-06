const express = require(`express`);

const actionsDb = require(`../../../../data/helpers/actionModel`);

const router = express.Router();

function validateActionId(req, res, next) {
  const id = req.params.actionId;

  actionsDb
    .get(id)
    .then(action => {
      if (action) {
        req.action = action;
        next();
      } else {
        res.status(404).json({ message: `action not found` });
      }
    })
    .catch(error => {
      console.error(`error retrieving action`, error);
      res
        .status(500)
        .json({ errorMessage: `error retrieving action from the database` });
    });
}

// get actions
router.get(`/`, (req, res) => {
  actionsDb
    .get()
    .then(actions => res.status(200).json(actions))
    .catch(error => {
      console.log(`error retrieving actions from the database`, error);
      res
        .status(500)
        .json({ errorMessage: `error retrieving actions from the database` });
    });
});

// update action
router.get(`/:actionId`, validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

// add new action
router.post(`/`, (req, res) => {
  const actionData = req.body;
  if (actionData.notes && actionData.description) {
    actionsDb
      .insert({ ...actionData, project_id: req.project.id })
      .then(action => res.status(201).json(action))
      .catch(error => {
        console.error(`error adding action to the database`, error);
        res
          .status(500)
          .json({ errorMessage: `error adding action to the database` });
      });
  } else {
    res
      .status(400)
      .json({ message: `body must contain notes and description` });
  }
});

// update action
router.put(`/:actionId`, validateActionId, (req, res) => {
  const actionData = req.body;
  if (actionData.notes || actionData.description || actionData.completed) {
    actionsDb
      .update(req.action.id, { ...actionData, project_id: req.project.id })
      .then(action => res.status(200).json(action))
      .catch(error => {
        console.error(`error updating action`, error);
        res.status(500).json({ errorMessage: `error updating action` });
      });
  } else {
    res
      .status(400)
      .json({ message: `body must contain notes or description or completed` });
  }
});

// delete action
router.delete(`/:actionId`, validateActionId, (req, res) => {
  actionsDb
    .remove(req.action.id)
    .then(removed =>
      res.status(202).json({ message: `${removed} action removed` })
    )
    .catch(error => {
      console.error(`unable to remove action from the database`, error);
      res.status(500).json({ errorMessage: `error removing action` });
    });
});

module.exports = router;
