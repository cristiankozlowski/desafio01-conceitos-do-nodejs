const express = require('express');

const server = express();

server.use(express.json());

const projects = [
  {"id": "1", "title": "ReactJS Project", "tasks": []},
  {"id": "2", "title": "NodeJS Project", "tasks": []},
  {"id": "3", "title": "React Native Project", "tasks": []},
]

/*Middleware to validate if project exists*/
function projectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if(!project) {
    return res.status(400).json({ error: 'Project not found'});
  }

  return next();
}

/*Middleware to count the number of requires done*/
function countReqs(req, res, next) {
  console.count('Número de requisições');

  return next();
}

server.use(countReqs);

/*Rotas*/
server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({id, title, tasks});

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', projectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', projectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post('/projects/:id/tasks', projectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);
  
  return res.json(project);
});


server.listen('3000');