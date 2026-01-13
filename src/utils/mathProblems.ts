export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MathProblem {
  question: string;
  answer: number;
  difficulty: Difficulty;
}

type Operation = '+' | '-' | '×';

const DIFFICULTY_RANGES: Record<Difficulty, { min: number; max: number; operations: Operation[] }> = {
  easy: { min: 1, max: 10, operations: ['+', '-'] },
  medium: { min: 10, max: 50, operations: ['+', '-', '×'] },
  hard: { min: 20, max: 100, operations: ['+', '-', '×'] },
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMathProblem(difficulty: Difficulty): MathProblem {
  const { min, max, operations } = DIFFICULTY_RANGES[difficulty];
  const operation = randomElement(operations);

  let a = randomInt(min, max);
  let b = randomInt(min, max);
  let answer: number;
  let question: string;

  switch (operation) {
    case '+':
      answer = a + b;
      question = `${a} + ${b}`;
      break;
    case '-':
      // Ensure positive result for easier mental math
      if (b > a) [a, b] = [b, a];
      answer = a - b;
      question = `${a} - ${b}`;
      break;
    case '×':
      // Use smaller numbers for multiplication
      a = randomInt(2, Math.min(12, max / 2));
      b = randomInt(2, Math.min(12, max / 2));
      answer = a * b;
      question = `${a} × ${b}`;
      break;
    default:
      answer = a + b;
      question = `${a} + ${b}`;
  }

  return { question, answer, difficulty };
}

export function checkAnswer(problem: MathProblem, userAnswer: number): boolean {
  return problem.answer === userAnswer;
}
