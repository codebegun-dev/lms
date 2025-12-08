 export const QUESTION_TYPES = {
  SINGLE: "single",
  MULTIPLE: "multiple",
  MANUAL: "manual",
  CODING: "coding",
};

export const QUESTION_TYPE_OPTIONS = [
  { label: "Single Choice", value: QUESTION_TYPES.SINGLE },
  { label: "Multiple Choice", value: QUESTION_TYPES.MULTIPLE },
  { label: "Manual Answer", value: QUESTION_TYPES.MANUAL },
  { label: "Coding Question", value: QUESTION_TYPES.CODING },
];

export const QUESTION_TYPE_DESCRIPTIONS = {
  [QUESTION_TYPES.SINGLE]: "Choose only one correct answer.",
  [QUESTION_TYPES.MULTIPLE]: "Choose one or more correct answers.",
  [QUESTION_TYPES.MANUAL]: "User types the answer during the test.",
  [QUESTION_TYPES.CODING]: "User submits code; evaluated by test cases.",
};
