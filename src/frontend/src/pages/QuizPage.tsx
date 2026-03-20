import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { CheckCircle2, Clock, RotateCcw, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { PracticeQuestion } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllTopics,
  useQuizQuestions,
  useRecordQuizResult,
} from "../hooks/useQueries";

const QUIZ_SIZE = 10;
const TOTAL_SECONDS = 60 * QUIZ_SIZE;

interface AnswerRecord {
  questionIdx: number;
  selected: number;
  correct: boolean;
}

export default function QuizPage() {
  const search = useSearch({ from: "/quiz" }) as { topicId?: string };
  const navigate = useNavigate();
  const { data: topics } = useAllTopics();
  const topicId = search.topicId || "";
  const { data: allQuestions, isLoading } = useQuizQuestions(topicId);
  const recordQuizResult = useRecordQuizResult();
  const { identity } = useInternetIdentity();

  const [quiz, setQuiz] = useState<PracticeQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [quizDone, setQuizDone] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (allQuestions && allQuestions.length > 0) {
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      setQuiz(shuffled.slice(0, Math.min(QUIZ_SIZE, shuffled.length)));
    }
  }, [allQuestions]);

  const finishQuiz = useCallback(
    (finalAnswers: AnswerRecord[]) => {
      setQuizDone(true);
      const score = finalAnswers.filter((a) => a.correct).length;
      if (identity && topicId) {
        recordQuizResult.mutate({ topicId, score, total: finalAnswers.length });
      }
    },
    [identity, topicId, recordQuizResult],
  );

  useEffect(() => {
    if (!quizStarted || quizDone) return;
    if (timeLeft <= 0) {
      finishQuiz(answers);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [quizStarted, quizDone, timeLeft, answers, finishQuiz]);

  function startQuiz() {
    setCurrentIdx(0);
    setSelected(null);
    setAnswers([]);
    setTimeLeft(TOTAL_SECONDS);
    setQuizDone(false);
    setQuizStarted(true);
  }

  function handleSelect(optionIdx: number) {
    if (selected !== null) return;
    setSelected(optionIdx);
    const correct = Number(quiz[currentIdx].correctOption) === optionIdx;
    const newAnswers = [
      ...answers,
      { questionIdx: currentIdx, selected: optionIdx, correct },
    ];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentIdx + 1 >= quiz.length) {
        finishQuiz(newAnswers);
      } else {
        setCurrentIdx((i) => i + 1);
        setSelected(null);
      }
    }, 1000);
  }

  const currentQuestion = quiz[currentIdx];
  const score = answers.filter((a) => a.correct).length;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerWarning = timeLeft <= 60;

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Quiz
          </h1>
          {quizStarted && !quizDone && (
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold",
                timerWarning
                  ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                  : "border-border bg-secondary text-foreground",
              )}
              data-ocid="quiz.timer"
            >
              <Clock className="w-4 h-4" />
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </div>
          )}
        </div>

        <div className="mb-8">
          <Select
            value={topicId}
            onValueChange={(v) => {
              navigate({ to: "/quiz", search: { topicId: v } });
              setQuizStarted(false);
              setQuizDone(false);
            }}
          >
            <SelectTrigger className="w-full md:w-72" data-ocid="quiz.select">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              {topics?.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.icon} {t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!topicId ? (
          <div className="text-center py-20" data-ocid="quiz.empty_state">
            <p className="text-muted-foreground text-lg">
              Select a topic to start the quiz.
            </p>
          </div>
        ) : isLoading ? (
          <div data-ocid="quiz.loading_state">
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        ) : !quizStarted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 rounded-2xl border border-border bg-card"
          >
            <div className="text-5xl mb-4">📝</div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Ready to test yourself?
            </h2>
            <p className="text-muted-foreground mb-2">
              {Math.min(QUIZ_SIZE, quiz.length)} questions · {QUIZ_SIZE} minute
              total timer
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Questions advance automatically after each answer.
            </p>
            <Button
              size="lg"
              onClick={startQuiz}
              className="gap-2"
              data-ocid="quiz.start_button"
            >
              Start Quiz
            </Button>
          </motion.div>
        ) : quizDone ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-border bg-card p-6"
            data-ocid="quiz.success_state"
          >
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">
                {score >= quiz.length * 0.8
                  ? "🏆"
                  : score >= quiz.length * 0.5
                    ? "👍"
                    : "📚"}
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-1">
                {score} / {quiz.length}
              </h2>
              <p className="text-muted-foreground">
                {score >= quiz.length * 0.8
                  ? "Outstanding!"
                  : score >= quiz.length * 0.5
                    ? "Good effort!"
                    : "Keep practicing!"}
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              {quiz.map((q, i) => {
                const ans = answers[i];
                const correct = ans?.correct;
                const correctOpt = Number(q.correctOption);
                return (
                  <div
                    key={q.id}
                    className={cn(
                      "rounded-xl border p-4",
                      correct
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-red-500/30 bg-red-500/5",
                    )}
                    data-ocid={`quiz.review.item.${i + 1}`}
                  >
                    <div className="flex items-start gap-3">
                      {correct ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground text-sm font-medium mb-1">
                          {q.question}
                        </p>
                        {!correct && ans !== undefined && (
                          <p className="text-red-400 text-xs mb-0.5">
                            Your answer: {q.options[ans.selected]}
                          </p>
                        )}
                        <p className="text-green-400 text-xs mb-2">
                          Correct: {q.options[correctOpt]}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={startQuiz}
                className="gap-2"
                data-ocid="quiz.restart_button"
              >
                <RotateCcw className="w-4 h-4" /> Retry Quiz
              </Button>
              <Link to="/practice" search={{ topicId }}>
                <Button
                  variant="outline"
                  className="gap-2 border-border"
                  data-ocid="quiz.practice_button"
                >
                  More Practice
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : currentQuestion ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(currentIdx / quiz.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {currentIdx + 1}/{quiz.length}
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 mb-5">
                <p className="text-sm text-muted-foreground font-medium mb-3">
                  Question {currentIdx + 1}
                </p>
                <p className="text-foreground text-lg leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((opt, i) => {
                  const isRight = Number(currentQuestion.correctOption) === i;
                  let cls =
                    "border-border text-foreground hover:border-primary/40 hover:bg-secondary cursor-pointer";
                  if (selected !== null) {
                    if (isRight)
                      cls =
                        "border-green-500/50 bg-green-500/10 text-green-400 cursor-default";
                    else if (selected === i)
                      cls =
                        "border-red-500/50 bg-red-500/10 text-red-400 cursor-default";
                    else
                      cls =
                        "border-border text-muted-foreground opacity-50 cursor-default";
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect(i)}
                      disabled={selected !== null}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3",
                        cls,
                      )}
                      data-ocid={`quiz.option.${i + 1}`}
                    >
                      <span>{opt}</span>
                      {selected !== null && isRight && (
                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                      )}
                      {selected !== null && selected === i && !isRight && (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="quiz.empty_state"
          >
            No quiz questions available for this topic.
          </div>
        )}
      </motion.div>
    </main>
  );
}
