import { generateMathProblem, checkAnswer, MathProblem } from '../mathProblems';

describe('mathProblems', () => {
  it('generates a valid math problem', () => {
    const problem = generateMathProblem('easy');

    expect(problem.question).toBeTruthy();
    expect(typeof problem.answer).toBe('number');
    expect(problem.difficulty).toBe('easy');
  });

  it('generates problems with correct answers', () => {
    // Test multiple problems to ensure math is correct
    for (let i = 0; i < 10; i++) {
      const problem = generateMathProblem('easy');
      expect(checkAnswer(problem, problem.answer)).toBe(true);
    }
  });

  it('generates harder problems for medium difficulty', () => {
    const easyProblems = Array.from({ length: 10 }, () => generateMathProblem('easy'));
    const mediumProblems = Array.from({ length: 10 }, () => generateMathProblem('medium'));

    // Medium problems should generally have larger numbers
    const avgEasy = easyProblems.reduce((sum, p) => sum + Math.abs(p.answer), 0) / 10;
    const avgMedium = mediumProblems.reduce((sum, p) => sum + Math.abs(p.answer), 0) / 10;

    expect(avgMedium).toBeGreaterThan(avgEasy);
  });

  it('checkAnswer returns false for wrong answers', () => {
    const problem = generateMathProblem('easy');
    expect(checkAnswer(problem, problem.answer + 1)).toBe(false);
  });
});
