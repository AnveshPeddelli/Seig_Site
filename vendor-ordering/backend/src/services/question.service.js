const questionRepo = require("../repositories/question.repository");
const { AppError, ensureString, ensureIntArray } = require("../utils/validation");

const mapOptions = (options) => {
  if (!Array.isArray(options) || options.length === 0) {
    throw new AppError("options must be a non-empty array");
  }

  return options.map((option, index) => ({
    text: ensureString(option.text, `options[${index}].text`),
    products: {
      connect: ensureIntArray(option.productIds, `options[${index}].productIds`).map((id) => ({
        id,
      })),
    },
  }));
};

const listQuestions = () => questionRepo.getQuestions();

const getQuestion = async (id) => {
  const question = await questionRepo.getQuestionById(id);

  if (!question) {
    throw new AppError("Question not found", 404);
  }

  return question;
};

const createQuestion = async (payload) => {
  const text = ensureString(payload.text, "text");
  const options = mapOptions(payload.options);

  return questionRepo.createQuestion({
    text,
    options: {
      create: options,
    },
  });
};

const updateQuestion = async (id, payload) => {
  await getQuestion(id);

  const data = {};

  if (payload.text !== undefined) {
    data.text = ensureString(payload.text, "text");
  }

  if (payload.options !== undefined) {
    data.options = {
      deleteMany: {},
      create: mapOptions(payload.options),
    };
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("No valid fields provided for update");
  }

  return questionRepo.updateQuestion(id, data);
};

const deleteQuestion = async (id) => {
  await getQuestion(id);
  await questionRepo.deleteQuestion(id);
};

module.exports = {
  listQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
