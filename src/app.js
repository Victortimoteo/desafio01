const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function CheckRepositorieExists(request, response, next) {
  const { id } = request.params;
  const repositorie = repositories.find(p => p.id === id);

  if (!repositorie) {
    return response.status(400).json({ error: 'Repositories not found' });
  }

  return next();
}

function logRequests(request, response, next) {
  
  console.count("Número de requisições");

  return next();

}

app.use("/repositories/:id", CheckRepositorieExists);

app.get("/repositories", (request, response) => {

  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { title, url, tech } = request.body;

  const repositorie = { id:uuid(), title, url, tech, likes:[] };

  repositories.push(repositorie);
  

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, tech } = request.body;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if(projectIndex < 0) {
    return response.status(400).json({error: 'Project not found.'});
  }

  const project = {
    id,
    title,
    url,
    tech,
  };

  repositories[projectIndex] = project;

  return response.json(project);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if(projectIndex < 0) {
    return response.status(400).json({error: 'Project not found.'});
  }

  repositories.splice(projectIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/likes",CheckRepositorieExists, logRequests,(request, response) => {
  const { id } = request.params;

  const { like } = request.params;

  const repositorie = repositories.find(p => p.id === id);


  repositorie.likes.push(like);

 return response.json(repositorie);
  
});

module.exports = app;
