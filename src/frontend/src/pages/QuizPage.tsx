import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, RotateCcw, Trophy, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import {
  useAllTopics,
  useQuizQuestions,
  useRecordQuizResult,
} from "../hooks/useQueries";

const FALLBACK_QUESTIONS = [
  {
    id: "a1",
    topicId: "algebra",
    question: "Solve: 2x + 4 = 12",
    options: ["x = 3", "x = 4", "x = 8", "x = 2"],
    correctOption: BigInt(1),
    explanation: "2x = 8, so x = 4",
  },
  {
    id: "a2",
    topicId: "algebra",
    question: "What is 5² - 3²?",
    options: ["4", "16", "25", "34"],
    correctOption: BigInt(1),
    explanation: "25 - 9 = 16",
  },
  {
    id: "a3",
    topicId: "algebra",
    question: "Simplify: 3(x + 4)",
    options: ["3x + 4", "3x + 12", "x + 12", "12x + 3"],
    correctOption: BigInt(1),
    explanation: "Distribute: 3·x + 3·4 = 3x + 12",
  },
  {
    id: "a4",
    topicId: "algebra",
    question: "If f(x) = 2x + 1, what is f(3)?",
    options: ["5", "7", "9", "6"],
    correctOption: BigInt(1),
    explanation: "f(3) = 2(3) + 1 = 7",
  },
  {
    id: "a5",
    topicId: "algebra",
    question: "Factor: x² + 5x + 6",
    options: ["(x+2)(x+3)", "(x+1)(x+6)", "(x+6)(x-1)", "(x-2)(x-3)"],
    correctOption: BigInt(0),
    explanation: "Find two numbers that multiply to 6 and add to 5: 2 and 3.",
  },
  {
    id: "a6",
    topicId: "algebra",
    question: "What is the y-intercept of y = 3x - 2?",
    options: ["3", "2", "-2", "0"],
    correctOption: BigInt(2),
    explanation: "The y-intercept is b in y = mx + b, so -2.",
  },
  {
    id: "a7",
    topicId: "algebra",
    question: "Solve the inequality: x - 3 > 5",
    options: ["x > 2", "x > 8", "x < 8", "x < 2"],
    correctOption: BigInt(1),
    explanation: "Add 3 to both sides: x > 8",
  },
  {
    id: "a8",
    topicId: "algebra",
    question: "What is the value of (-3)²?",
    options: ["-9", "9", "-6", "6"],
    correctOption: BigInt(1),
    explanation: "(-3)² = (-3)×(-3) = 9",
  },
  {
    id: "a9",
    topicId: "algebra",
    question: "Solve: x/4 = 7",
    options: ["x = 3", "x = 11", "x = 28", "x = 1.75"],
    correctOption: BigInt(2),
    explanation: "Multiply both sides by 4: x = 28",
  },
  {
    id: "a10",
    topicId: "algebra",
    question: "Which represents a linear function?",
    options: ["y = x²", "y = 2x + 3", "y = √x", "y = 1/x"],
    correctOption: BigInt(1),
    explanation: "y = 2x + 3 is linear (degree 1).",
  },
];

const TOPIC_OPTIONS = [
  { id: "algebra", title: "Algebra" },
  { id: "geometry", title: "Geometry" },
  { id: "calculus", title: "Calculus" },
  { id: "statistics", title: "Statistics" },
  { id: "trigonometry", title: "Trigonometry" },
  { id: "functions", title: "Functions" },
];

type QuizState = "setup" | "running" | "finished";

export default function QuizPage() {
  const { data: topics } = useAllTopics();
  const [selectedTopic, setSelectedTopic] = useState("algebra");
  const [quizState, setQuizState] = useState<QuizState>("setup");
  const {
    data: fetchedQuestions,
    isLoading,
    refetch,
  } = useQuizQuestions(
    quizState === "running" || quizState === "finished" ? selectedTopic : "",
  );
  const recordResult = useRecordQuizResult();

  const questions = (
    fetchedQuestions && fetchedQuestions.length > 0
      ? fetchedQuestions
      : FALLBACK_QUESTIONS
  ).slice(0, 10) as typeof FALLBACK_QUESTIONS;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<
    Array<{ selected: number; correct: boolean }>
  >([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isAnswered, setIsAnswered] = useState(false);

  const endQuiz = useCallback(() => {
    setQuizState("finished");
    const score = answers.filter((a) => a.correct).length;
    recordResult.mutate({
      topicId: selectedTopic,
      score,
      total: questions.length,
    });
  }, [answers, selectedTopic, questions.length, recordResult]);

  useEffect(() => {
    if (quizState !== "running" || isAnswered) return;
    if (timeLeft <= 0) {
      setAnswers((prev) => [...prev, { selected: -1, correct: false }]);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((i) => i + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setTimeLeft(60);
      } else {
        endQuiz();
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, quizState, isAnswered, currentIdx, questions.length, endQuiz]);

  const handleSelect = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
    setIsAnswered(true);
    const correct = optionIdx === Number(questions[currentIdx].correctOption);
    setAnswers((prev) => [...prev, { selected: optionIdx, correct }]);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(60);
    } else {
      endQuiz();
    }
  };

  const startQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswers([]);
    setIsAnswered(false);
    setTimeLeft(60);
    setQuizState("running");
    refetch();
  };

  const resetQuiz = () => {
    setQuizState("setup");
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswers([]);
    setIsAnswered(false);
    setTimeLeft(60);
  };

  const score = answers.filter((a) => a.correct).length;
  const topicList = topics && topics.length > 0 ? topics : TOPIC_OPTIONS;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">Quiz Mode</h1>
        <p className="text-muted-foreground mt-1">
          10 questions, 60 seconds each. Test your knowledge!
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Setup */}
        {quizState === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-border shadow-card p-8 text-center"
            data-ocid="quiz.panel"
          >
            <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Ready to Test Yourself?
            </h2>
            <p className="text-muted-foreground mb-6">
              Choose a topic and start your timed quiz.
            </p>

            <div className="max-w-xs mx-auto mb-6">
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger data-ocid="quiz.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {topicList.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> 60s per question
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" /> 10 questions
              </div>
            </div>

            <Button
              size="lg"
              className="rounded-full px-10"
              onClick={startQuiz}
              data-ocid="quiz.primary_button"
            >
              Launch Quiz
            </Button>
          </motion.div>
        )}

        {/* Running */}
        {quizState === "running" && (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isLoading ? (
              <Skeleton
                className="h-80 rounded-2xl"
                data-ocid="quiz.loading_state"
              />
            ) : (
              <>
                {/* Timer + Progress bar */}
                <div className="bg-white rounded-xl border border-border shadow-xs p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Question {currentIdx + 1}/{questions.length}
                    </span>
                    <div
                      className={`flex items-center gap-1 text-sm font-bold ${timeLeft <= 10 ? "text-red-500" : "text-foreground"}`}
                    >
                      <Clock className="w-4 h-4" /> {timeLeft}s
                    </div>
                  </div>
                  <Progress value={(timeLeft / 60) * 100} className="h-2" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-2xl border border-border shadow-card p-6 mb-4"
                    data-ocid="quiz.card"
                  >
                    <Badge className="bg-primary/10 text-primary border-0 capitalize mb-4">
                      {selectedTopic}
                    </Badge>
                    <p className="text-lg font-semibold text-foreground mb-6">
                      {questions[currentIdx]?.question}
                    </p>
                    <div className="space-y-3">
                      {questions[currentIdx]?.options.map((opt, i) => {
                        let cls =
                          "border-border bg-white text-foreground hover:bg-accent";
                        if (isAnswered) {
                          if (i === Number(questions[currentIdx].correctOption))
                            cls = "border-green-400 bg-green-50 text-green-700";
                          else if (i === selectedOption)
                            cls = "border-red-400 bg-red-50 text-red-700";
                          else
                            cls =
                              "border-border bg-white text-muted-foreground opacity-50";
                        }
                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`w-full flex items-center gap-3 p-4 rounded-xl border text-sm text-left transition-all ${cls}`}
                            onClick={() => handleSelect(i)}
                            disabled={isAnswered}
                            data-ocid={`quiz.toggle.${i + 1}`}
                          >
                            <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0">
                              {String.fromCharCode(65 + i)}
                            </span>
                            {opt}
                            {isAnswered &&
                              i ===
                                Number(questions[currentIdx].correctOption) && (
                                <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                              )}
                            {isAnswered &&
                              i === selectedOption &&
                              i !==
                                Number(questions[currentIdx].correctOption) && (
                                <XCircle className="w-4 h-4 text-red-500 ml-auto" />
                              )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    <div
                      className={`rounded-xl p-3 mb-4 text-sm ${answers[answers.length - 1]?.correct ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}
                      data-ocid={
                        answers[answers.length - 1]?.correct
                          ? "quiz.success_state"
                          : "quiz.error_state"
                      }
                    >
                      {answers[answers.length - 1]?.correct
                        ? "✓ Correct!"
                        : "✗ Incorrect"}{" "}
                      — {questions[currentIdx]?.explanation}
                    </div>
                    <Button
                      className="w-full rounded-full"
                      onClick={handleNext}
                      data-ocid="quiz.primary_button"
                    >
                      {currentIdx < questions.length - 1
                        ? "Next Question"
                        : "See Results"}
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Finished */}
        {quizState === "finished" && (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-border shadow-card p-8"
            data-ocid="quiz.panel"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground mb-1">
                Quiz Complete!
              </h2>
              <p className="text-muted-foreground capitalize">
                {selectedTopic} · {questions.length} Questions
              </p>
              <div className="mt-4 text-5xl font-extrabold text-primary">
                {score}
                <span className="text-2xl text-muted-foreground">
                  /{questions.length}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {Math.round((score / questions.length) * 100)}% accuracy
              </p>
            </div>

            {/* Review */}
            <div className="space-y-3 mb-6">
              <h3 className="font-bold text-foreground">Review Answers</h3>
              {answers.map((ans, i) => (
                <div
                  key={questions[i]?.id ?? `ans-${i}`}
                  className={`flex items-start gap-3 p-3 rounded-xl text-sm ${ans.correct ? "bg-green-50" : "bg-red-50"}`}
                  data-ocid={`quiz.item.${i + 1}`}
                >
                  {ans.correct ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p
                      className={`font-medium ${ans.correct ? "text-green-700" : "text-red-700"}`}
                    >
                      {questions[i]?.question}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {questions[i]?.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="w-full rounded-full"
              variant="outline"
              onClick={resetQuiz}
              data-ocid="quiz.secondary_button"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
