// QuizValidation function - Updated
function QuizValidation(form) {
  const errors = {};

  // Quiz Title - REQUIRED
  if (!form.title || String(form.title).trim() === "") {
    errors.title = "Quiz title is required.";
  } else if (form.title.trim().length < 3) {
    errors.title = "Quiz title must be at least 3 characters.";
  }

  // Question Type - REQUIRED
  if (!form.type) {
    errors.type = "Question type is required.";
  }

  // Question Text - REQUIRED
  if (!form.question || String(form.question).trim() === "") {
    errors.question = "Question text is required.";
  } else if (form.question.trim().length < 10) {
    errors.question = "Question text must be at least 10 characters.";
  }

  // Validation based on question type
  if (form.type === QUESTION_TYPES.SINGLE || form.type === QUESTION_TYPES.MULTIPLE) {
    if (!Array.isArray(form.options) || form.options.length < 2) {
      errors.options = "At least two options are required.";
    } else {
      const emptyOpt = form.options.find(
        (o) => !o.text || String(o.text).trim() === ""
      );
      if (emptyOpt) errors.options = "All options must have text.";
      
      // Check for duplicate options
      const optionTexts = form.options.map(o => o.text.trim().toLowerCase());
      const hasDuplicates = optionTexts.some((text, index) => 
        optionTexts.indexOf(text) !== index
      );
      if (hasDuplicates) errors.options = "Options cannot be duplicates.";
    }

    if (!Array.isArray(form.correctAnswers) || form.correctAnswers.length === 0) {
      errors.correctAnswers = "Select at least one correct answer.";
    }

    if (form.type === QUESTION_TYPES.SINGLE && form.correctAnswers.length > 1) {
      errors.correctAnswers = "Only one correct answer allowed for single choice.";
    }
  } else if (form.type === QUESTION_TYPES.MANUAL) {
    if (!form.manualAnswer || String(form.manualAnswer).trim() === "") {
      errors.manualAnswer = "Manual answer cannot be empty.";
    } else if (form.manualAnswer.trim().length < 5) {
      errors.manualAnswer = "Manual answer must be at least 5 characters.";
    }
  } else if (form.type === QUESTION_TYPES.CODING) {
    if (!form.coding || String(form.coding.description).trim() === "") {
      errors.coding = "Coding question description is required.";
    } else if (form.coding.description.trim().length < 20) {
      errors.coding = "Coding description must be at least 20 characters.";
    }
  }

  // Marks validation - REQUIRED
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