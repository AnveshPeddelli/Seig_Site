const express = require("express");
const questionController = require("../controllers/question.controller");

const router = express.Router();

router.get("/", questionController.listQuestions);
router.post("/", questionController.createQuestion);
router.get("/:id", questionController.getQuestion);
router.patch("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);

module.exports = router;
