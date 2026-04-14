const prisma = require("../config/prisma");

const questionInclude = {
  options: {
    include: {
      products: {
        include: {
          specs: {
            include: {
              specification: true,
            },
          },
        },
      },
    },
  },
};

const getQuestions = () => prisma.question.findMany({ include: questionInclude });

const getQuestionById = (id) =>
  prisma.question.findUnique({
    where: { id },
    include: questionInclude,
  });

const createQuestion = (data) =>
  prisma.question.create({
    data,
    include: questionInclude,
  });

const updateQuestion = (id, data) =>
  prisma.question.update({
    where: { id },
    data,
    include: questionInclude,
  });

const deleteQuestion = (id) => prisma.question.delete({ where: { id } });

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
