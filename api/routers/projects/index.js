const express = require(`express`);

const projectsDb = require(`../../../data/helpers/projectModel`);

const router = express.Router();

router.use(express.json());

function validateId(req, res, next) {
  const id = req.params.id;

  projectsDb
    .get(id)
    .then(project => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(404).json({ message: `id ${id} not found.` });
      }
    })
    .catch(error => {
      console.error(`error validating id`, error);
      res
        .status(500)
        .json({ errorMessage: `error retrieving project from the database` });
    });
}

// get projects
router.get(`/`, (req, res) => {
  projectsDb
    .get()
    .then(projects => {
      if (projects.length > 0) {
        res.status(200).json(projects);
      } else {
        res.status(404).json({ message: `no projects found` });
      }
    })
    .catch(error => {
      console.error(`error getting projects`, error);
      res
        .status(500)
        .json({ errorMessage: `error retrieving projects from the database` });
    });
});

// get project actions
router.get(`/:id`, validateId, (req, res) => {
  res.status(200).json(req.project);
});

// add new project
router.post(`/`, (req, res) => {
  const projectData = req.body;

  if (projectData.name && projectData.description) {
    projectsDb
      .insert(projectData)
      .then(project => res.status(201).json(project))
      .catch(error => {
        console.error(`could not insert into database`, error);
        res
          .status(500)
          .json({ errorMessage: `could not add project to database` });
      });
  } else {
    res
      .status(400)
      .json({ message: `post body must contain name and description` });
  }
});

// update project
router.put(`/:id`, validateId, (req, res) => {
  const updateData = req.body;

  if (updateData.name || updateData.description) {
    projectsDb
      .update(req.project.id, updateData)
      .then(project => res.status(201).json(project))
      .catch(error => {
        console.error(`could not update project`, error);
        res.status(500).json({ errorMessage: `could not update project data` });
      });
  } else {
    res.status(400).json({
      message: `body must contain either name or description to update`
    });
  }
});

// delete project
router.delete(`/:id`, validateId, (req, res) => {
  projectsDb
    .remove(req.project.id)
    .then(deleted =>
      res.status(202).json({ message: `${deleted} project deleted` })
    )
    .catch(error => {
      console.log(`could not delete from database`, error);
      res
        .status(500)
        .json({ errorMessage: `Could not delete project from database` });
    });
});

module.exports = router;
