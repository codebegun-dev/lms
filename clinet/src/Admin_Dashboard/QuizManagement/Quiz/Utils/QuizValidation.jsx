// QuizValidation.jsx
import { QUESTION_TYPES } from "./QuestionTypes";

/**
 *  QuizValidation(form)
 * Returns an object with error messages for invalid fields.
 */
export function QuizValidation(form) {
  const errors = {};

  if (!form.title || String(form.title).trim() === "") {
    errors.title = "Quiz title is required.";
  }

  if (!form.question || String(form.question).trim() === "") {
    errors.question = "Question text is required.";
  }

  if (!form.type) {
    errors.type = "Question type is required.";
  } else if (
    form.type === QUESTION_TYPES.SINGLE ||
    form.type === QUESTION_TYPES.MULTIPLE
  ) {
    if (!Array.isArray(form.options) || form.options.length < 2) {
      errors.options = "At least two options are required.";
    } else {
      // ensure option texts are not empty
      const emptyOpt = form.options.find(
        (o) => !o.text || String(o.text).trim() === ""
      );
      if (emptyOpt) errors.options = "All options must have text.";
    }

    if (
      !Array.isArray(form.correctAnswers) ||
      form.correctAnswers.length === 0
    ) {
      errors.correctAnswers = "Select at least one correct answer.";
    }

    // if single, ensure only one correct
    if (form.type === QUESTION_TYPES.SINGLE && form.correctAnswers.length > 1) {
      errors.correctAnswers = "Only one correct answer allowed for single choice.";
    }
  } else if (form.type === QUESTION_TYPES.MANUAL) {
    if (!form.manualAnswer || String(form.manualAnswer).trim() === "") {
      errors.manualAnswer = "Manual answer cannot be empty.";
    }
  } else if (form.type === QUESTION_TYPES.CODING) {
    // basic validations for coding question
    if (!form.coding || String(form.coding.description).trim() === "") {
      errors.coding = "Coding question description required.";
    }
    // At least one sample input/output recommended
    // hidden test cases may be zero in the builder, that's acceptable
  }

  // marks validation
  if (form.positiveMarks === "" || form.positiveMarks === null || Number.isNaN(Number(form.positiveMarks))) {
    errors.positiveMarks = "Positive marks are required.";
  } else if (Number(form.positiveMarks) <= 0) {
    errors.positiveMarks = "Positive marks must be greater than 0.";
  }

  if (form.negativeMarks === "" || form.negativeMarks === null || Number.isNaN(Number(form.negativeMarks))) {
    errors.negativeMarks = "Negative marks are required (0 allowed).";
  } else if (Number(form.negativeMarks) < 0) {
    errors.negativeMarks = "Negative marks cannot be negative.";
  } else if (Number(form.negativeMarks) > Number(form.positiveMarks)) {
    errors.negativeMarks = "Negative marks should not exceed positive marks.";
  }

  return errors;
}
