const questionService = require("../services/question.service");
const asyncHandler = require("../utils/async-handler");
const { ensureInt } = require("../utils/validation");

const listQuestions = asyncHandler(async (req, res) => {
  const questions = await questionService.listQuestions();
  res.json(questions);
});

const getQuestion = asyncHandler(async (req, res) => {
  const question = await questionService.getQuestion(ensureInt(req.params.id, "questionId"));
  res.json(question);
});

const createQuestion = asyncHandler(async (req, res) => {
  const question = await questionService.createQuestion(req.body);
  res.status(201).json(question);
});

const updateQuestion = asyncHandler(async (req, res) => {
  const question = await questionService.updateQuestion(ensureInt(req.params.id, "questionId"), req.body);
  res.json(question);
});

const deleteQuestion = asyncHandler(async (req, res) => {
  await questionService.deleteQuestion(ensureInt(req.params.id, "questionId"));
  res.status(204).send();
});

module.exports = {
  listQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
