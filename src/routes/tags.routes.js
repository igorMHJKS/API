const { Router } = require("express");

const TagsController = require("../controllers/tagsController")
const tagsRouter = Router();

const tagsController = new TagsController();

tagsRouter.get("/", tagsController.index)



module.exports = tagsRouter;