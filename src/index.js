const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [
  {
    id: "1234",
    url: "https://github.com/Rocketseat/umbriel",
    title: "Umbriel",
    techs: ["Node", "Express", "TypeScript"],
    likes: 0,
  },
];

const getRepository = (request, response, next) => {
  const { id } = request.params;

  const repository = repositories.find((repo) => repo.id === id);

  if (!repository)
    return response.status(404).json({ error: "Repository not found!" });

  const repoIndex = repositories.findIndex((repo) => repo.id === repository.id);

  request.repository = repository;
  request.repoIndex = repoIndex;

  next();
};

const repositoriesEditableProps = ["url", "title", "techs"];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", getRepository, (request, response) => {
  const { repository } = request;

  for (let param in request.body) {
    if (repositoriesEditableProps.includes(param) && param && param.length > 0)
      repository[param] = request.body[param];
  }

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", getRepository, (request, response) => {
  const { repoIndex } = request;

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", getRepository, (request, response) => {
  const { repository } = request;

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
