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
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  useAllTopics,
  usePracticeQuestions,
  useSubmitAnswer,
} from "../hooks/useQueries";

const FALLBACK_QUESTIONS = [
  {
    id: "q1",
    topicId: "algebra",
    question: "Solve for x: 3x - 7 = 11",
    options: ["x = 4", "x = 6", "x = 18", "x = 2"],
    correctOption: BigInt(1),
    explanation: "Add 7 to both sides: 3x = 18, then divide by 3: x = 6.",
  },
  {
    id: "q2",
    topicId: "algebra",
    question: "What is the value of 4² + 3²?",
    options: ["25", "49", "7", "14"],
    correctOption: BigInt(0),
    explanation: "4² = 16, 3² = 9, so 16 + 9 = 25.",
  },
  {
    id: "q3",
    topicId: "algebra",
    question: "Factor the expression: x² - 9",
    options: ["(x-3)(x-3)", "(x+3)(x-3)", "(x+9)(x-1)", "(x-9)(x+1)"],
    correctOption: BigInt(1),
    explanation:
      "This is a difference of squares: a² - b² = (a+b)(a-b), so x² - 9 = (x+3)(x-3).",
  },
  {
    id: "q4",
    topicId: "algebra",
    question: "What is the slope of the line y = 2x + 5?",
    options: ["5", "2", "-2", "1/2"],
    correctOption: BigInt(1),
    explanation:
      "In slope-intercept form y = mx + b, m is the slope. Here m = 2.",
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

export default function PracticePage() {
  const { data: topics } = useAllTopics();
  const [selectedTopic, setSelectedTopic] = useState("algebra");
  const { data: fetchedQuestions, isLoading } =
    usePracticeQuestions(selectedTopic);
  const submitAnswer = useSubmitAnswer();

  const questions = (
    fetchedQuestions && fetchedQuestions.length > 0
      ? fetchedQuestions
      : FALLBACK_QUESTIONS
  ) as typeof FALLBACK_QUESTIONS;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answered, setAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Reset when topic changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: selectedTopic drives reset
  useEffect(() => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setAnswered(0);
    setCorrectCount(0);
  }, [selectedTopic]);

  const question = questions[currentIdx];

  const handleSelect = async (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    let result: boolean;
    try {
      result = await submitAnswer.mutateAsync({
        questionId: question.id,
        selectedOption: optionIdx,
      });
    } catch {
      result = optionIdx === Number(question.correctOption);
    }
    setIsCorrect(result);
    setAnswered((a) => a + 1);
    if (result) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Skeleton
          className="h-64 rounded-2xl"
          data-ocid="practice.loading_state"
        />
      </main>
    );
  }

  const topicList = topics && topics.length > 0 ? topics : TOPIC_OPTIONS;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">
            Practice Questions
          </h1>
          <p className="text-muted-foreground mt-1">
            One question at a time. Learn from every answer.
          </p>
        </div>
        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
          <SelectTrigger className="w-40" data-ocid="practice.select">
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

      {/* Progress */}
      <div className="bg-white rounded-xl border border-border shadow-xs p-4 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span className="font-semibold text-foreground">
            {answered > 0 ? Math.round((correctCount / answered) * 100) : 0}%
            accuracy
          </span>
        </div>
        <Progress
          value={(currentIdx / questions.length) * 100}
          className="h-2"
        />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-border shadow-card p-6 mb-6"
          data-ocid="practice.card"
        >
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-primary/10 text-primary border-0 capitalize">
              {selectedTopic}
            </Badge>
          </div>
          <p className="text-lg font-semibold text-foreground mb-6">
            {question?.question}
          </p>

          <div className="space-y-3">
            {question?.options.map((opt, i) => {
              let cls =
                "border-border bg-white text-foreground hover:bg-accent";
              if (selectedOption !== null) {
                if (i === Number(question.correctOption))
                  cls = "border-green-400 bg-green-50 text-green-700";
                else if (i === selectedOption && !isCorrect)
                  cls = "border-red-400 bg-red-50 text-red-700";
                else
                  cls =
                    "border-border bg-white text-muted-foreground opacity-60";
              }
              return (
                <button
                  key={opt}
                  type="button"
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-sm text-left transition-all cursor-pointer ${cls}`}
                  onClick={() => handleSelect(i)}
                  disabled={selectedOption !== null}
                  data-ocid={`practice.toggle.${i + 1}`}
                >
                  <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {selectedOption !== null &&
                    i === Number(question.correctOption) && (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    )}
                  {selectedOption === i &&
                    !isCorrect &&
                    i !== Number(question.correctOption) && (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl p-4 mb-6 ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            data-ocid={
              isCorrect ? "practice.success_state" : "practice.error_state"
            }
          >
            <p
              className={`text-sm font-semibold mb-1 ${isCorrect ? "text-green-700" : "text-red-700"}`}
            >
              {isCorrect ? "✓ Correct!" : "✗ Not quite right"}
            </p>
            <p
              className={`text-sm ${isCorrect ? "text-green-600" : "text-red-600"}`}
            >
              {question?.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedOption !== null && (
        <Button
          className="w-full rounded-full"
          onClick={handleNext}
          disabled={currentIdx >= questions.length - 1}
          data-ocid="practice.primary_button"
        >
          {currentIdx < questions.length - 1 ? (
            <>
              Next Question <ArrowRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            "All Done!"
          )}
        </Button>
      )}
    </main>
  );
}
