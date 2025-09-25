'use client';

import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

interface AssessmentQuizProps {
  questions: QuizQuestion[];
  className?: string;
}

interface ResponseState {
  [questionId: string]: number | undefined;
}

export function AssessmentQuiz({ questions, className }: AssessmentQuizProps): JSX.Element {
  const [responses, setResponses] = useState<ResponseState>({});

  const { answeredCount, correctCount } = useMemo(() => {
    let answered = 0;
    let correct = 0;
    for (const question of questions) {
      const response = responses[question.id];
      if (response === undefined) {
        continue;
      }
      answered += 1;
      if (response === question.answerIndex) {
        correct += 1;
      }
    }
    return { answeredCount: answered, correctCount: correct };
  }, [questions, responses]);

  function handleSelect(questionId: string, optionIndex: number): void {
    setResponses((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function handleReset(): void {
    setResponses({});
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        <p>
          Answered {answeredCount}/{questions.length} · Correct {correctCount}/{questions.length}
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition hover:border-foreground/40 hover:bg-accent"
        >
          Reset answers
        </button>
      </div>

      <ol className="space-y-6">
        {questions.map((question, questionIndex) => {
          const selected = responses[question.id];
          const isAnswered = selected !== undefined;
          const isCorrect = isAnswered && selected === question.answerIndex;

          return (
            <li
              key={question.id}
              className="space-y-4 rounded-2xl border border-border bg-card/70 p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                  {questionIndex + 1}
                </span>
                <p id={`${question.id}-prompt`} className="font-medium text-foreground">
                  {question.prompt}
                </p>
              </div>

              <div
                role="radiogroup"
                aria-labelledby={`${question.id}-prompt`}
                className="space-y-3"
              >
                {question.options.map((option, optionIndex) => {
                  const optionSelected = selected === optionIndex;
                  const optionCorrect = optionIndex === question.answerIndex;
                  const baseClasses =
                    'w-full rounded-xl border px-4 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
                  const stateClasses = optionSelected
                    ? optionCorrect
                      ? 'border-green-500 bg-green-50 text-green-900 dark:border-green-400 dark:bg-green-950/40 dark:text-green-200'
                      : 'border-red-500 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-950/40 dark:text-red-200'
                    : 'border-border bg-background text-foreground hover:border-foreground/40 hover:bg-accent';

                  return (
                    <button
                      key={optionIndex}
                      type="button"
                      role="radio"
                      aria-checked={optionSelected}
                      onClick={() => handleSelect(question.id, optionIndex)}
                      className={cn(baseClasses, stateClasses)}
                    >
                      <span className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-muted-foreground">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span>{option}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {isAnswered ? (
                <div
                  className={cn(
                    'rounded-lg border px-4 py-3 text-sm',
                    isCorrect
                      ? 'border-green-500 bg-green-50 text-green-900 dark:border-green-400 dark:bg-green-950/40 dark:text-green-200'
                      : 'border-red-500 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-950/40 dark:text-red-200'
                  )}
                >
                  <p className="font-semibold">
                    {isCorrect ? 'Nice work — correct!' : 'Not quite right.'}
                  </p>
                  <p className="mt-1 text-sm">{question.explanation}</p>
                  {!isCorrect ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Try a different option — the feedback updates immediately.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
