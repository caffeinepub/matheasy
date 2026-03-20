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
import { CheckCircle2, ChevronRight, RotateCcw, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllTopics,
  usePracticeQuestions,
  useSubmitAnswer,
} from "../hooks/useQueries";

export default function PracticePage() {
  const search = useSearch({ from: "/practice" }) as { topicId?: string };
  const navigate = useNavigate();
  const { data: topics } = useAllTopics();
  const topicId = search.topicId || "";
  const { data: questions, isLoading } = usePracticeQuestions(topicId);
  const submitAnswer = useSubmitAnswer();
  const { identity } = useInternetIdentity();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions?.[currentIdx];

  function handleSelect(optionIdx: number) {
    if (selected !== null) return;
    setSelected(optionIdx);
    const correct = Number(currentQuestion!.correctOption) === optionIdx;
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setAnswered((a) => a + 1);
    setShowExplanation(true);
    if (identity) {
      submitAnswer.mutate({
        questionId: currentQuestion!.id,
        selectedOption: optionIdx,
      });
    }
  }

  function handleNext() {
    setSelected(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setCurrentIdx((i) => i + 1);
  }

  function handleReset() {
    setCurrentIdx(0);
    setSelected(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setScore(0);
    setAnswered(0);
  }

  const done = questions && currentIdx >= questions.length;

  return (
    <main className="container mx-auto px-4 py-10 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Practice
          </h1>
          {answered > 0 && (
            <Badge variant="secondary" className="text-base px-3 py-1">
              {score}/{answered} correct
            </Badge>
          )}
        </div>

        <div className="mb-8">
          <Select
            value={topicId}
            onValueChange={(v) => {
              navigate({ to: "/practice", search: { topicId: v } });
              handleReset();
            }}
          >
            <SelectTrigger
              className="w-full md:w-72"
              data-ocid="practice.select"
            >
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
          <div className="text-center py-20" data-ocid="practice.empty_state">
            <p className="text-muted-foreground text-lg">
              Select a topic above to start practicing.
            </p>
          </div>
        ) : isLoading ? (
          <div data-ocid="practice.loading_state">
            <Skeleton className="h-64 rounded-2xl mb-4" />
            <Skeleton className="h-12 rounded-xl mb-3" />
            <Skeleton className="h-12 rounded-xl mb-3" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        ) : done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 rounded-2xl border border-border bg-card"
            data-ocid="practice.success_state"
          >
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              All done!
            </h2>
            <p className="text-muted-foreground mb-2">
              You scored{" "}
              <span className="text-primary font-semibold">{score}</span> out of{" "}
              <span className="font-semibold">{questions.length}</span>
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              {score === questions.length
                ? "Perfect score! 🌟"
                : score >= questions.length * 0.7
                  ? "Great work! Keep it up."
                  : "Keep practicing to improve!"}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={handleReset}
                className="gap-2"
                data-ocid="practice.reset_button"
              >
                <RotateCcw className="w-4 h-4" /> Practice Again
              </Button>
              <Link to="/quiz" search={{ topicId }}>
                <Button
                  variant="outline"
                  className="gap-2 border-border"
                  data-ocid="practice.quiz_button"
                >
                  Take a Quiz <ChevronRight className="w-4 h-4" />
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
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{
                      width: `${(currentIdx / questions!.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {currentIdx + 1} / {questions!.length}
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

              <div className="flex flex-col gap-3 mb-5">
                {currentQuestion.options.map((opt, i) => {
                  const isRight = Number(currentQuestion.correctOption) === i;
                  let optClass =
                    "border-border text-foreground hover:bg-secondary";

                  if (selected !== null) {
                    if (isRight)
                      optClass =
                        "border-green-500/50 bg-green-500/10 text-green-400";
                    else if (selected === i)
                      optClass = "border-red-500/50 bg-red-500/10 text-red-400";
                    else
                      optClass =
                        "border-border text-muted-foreground opacity-60";
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect(i)}
                      disabled={selected !== null}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3",
                        optClass,
                        selected === null &&
                          "hover:border-primary/40 cursor-pointer",
                      )}
                      data-ocid={`practice.option.${i + 1}`}
                    >
                      <span className="leading-relaxed">{opt}</span>
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

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-xl border p-4 mb-5",
                    isCorrect
                      ? "border-green-500/30 bg-green-500/10"
                      : "border-orange-500/30 bg-orange-500/10",
                  )}
                  data-ocid="practice.explanation"
                >
                  <p
                    className={cn(
                      "text-sm font-semibold mb-1",
                      isCorrect ? "text-green-400" : "text-orange-400",
                    )}
                  >
                    {isCorrect ? "✓ Correct!" : "✗ Not quite"}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}

              {selected !== null && (
                <Button
                  onClick={handleNext}
                  className="w-full gap-2"
                  data-ocid="practice.next_button"
                >
                  {currentIdx + 1 < questions!.length
                    ? "Next Question"
                    : "See Results"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="practice.empty_state"
          >
            No practice questions available for this topic.
          </div>
        )}
      </motion.div>
    </main>
  );
}
