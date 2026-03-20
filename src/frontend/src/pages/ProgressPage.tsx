import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  CheckCircle2,
  LogIn,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProgress } from "../hooks/useQueries";

const SKELETON_STATS = ["sk-stat-1", "sk-stat-2", "sk-stat-3"];

export default function ProgressPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const { data: progress, isLoading } = useUserProgress();

  if (!isLoggedIn) {
    return (
      <main className="max-w-md mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-3">
            Track Your Progress
          </h1>
          <p className="text-muted-foreground mb-8">
            Log in to see your learning history, accuracy stats, and quiz
            results.
          </p>
          <Button
            size="lg"
            className="rounded-full px-10"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="progress.primary_button"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {isLoggingIn ? "Logging in…" : "Log In to View Progress"}
          </Button>
        </motion.div>
      </main>
    );
  }

  if (isLoading || !progress) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Skeleton
          className="h-10 w-48 mb-8 rounded-xl"
          data-ocid="progress.loading_state"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {SKELETON_STATS.map((k) => (
            <Skeleton key={k} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </main>
    );
  }

  const totalAnswered = Number(progress.questionsAnswered);
  const totalCorrect = Number(progress.correctAnswers);
  const accuracy =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const topicsStarted = progress.startedTopics.length;
  const quizHistory = progress.quizHistory;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-extrabold text-foreground mb-2">
          My Progress
        </h1>
        <p className="text-muted-foreground mb-8">
          {identity.getPrincipal().toString().slice(0, 16)}…
        </p>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: BookOpen,
              label: "Topics Started",
              value: topicsStarted,
              color: "text-blue-600",
              bg: "bg-blue-50",
              key: "topics",
            },
            {
              icon: Target,
              label: "Questions Answered",
              value: totalAnswered,
              color: "text-primary",
              bg: "bg-orange-50",
              key: "questions",
            },
            {
              icon: Trophy,
              label: "Accuracy",
              value: `${accuracy}%`,
              color: "text-green-600",
              bg: "bg-green-50",
              key: "accuracy",
            },
          ].map(({ icon: Icon, label, value, color, bg, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-border shadow-card p-6"
              data-ocid={`progress.card.${i + 1}`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-foreground">
                {value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Accuracy bar */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6 mb-6">
          <h2 className="font-bold text-foreground mb-3">Overall Accuracy</h2>
          <div className="flex items-center gap-3">
            <Progress value={accuracy} className="flex-1 h-3" />
            <span className="text-sm font-bold text-foreground w-12 text-right">
              {accuracy}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {totalCorrect} correct out of {totalAnswered} questions answered
          </p>
        </div>

        {/* Topics started */}
        {progress.startedTopics.length > 0 && (
          <div className="bg-white rounded-2xl border border-border shadow-card p-6 mb-6">
            <h2 className="font-bold text-foreground mb-3">
              Topics In Progress
            </h2>
            <div className="flex flex-wrap gap-2">
              {progress.startedTopics.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quiz history */}
        <div className="bg-white rounded-2xl border border-border shadow-card p-6">
          <h2 className="font-bold text-foreground mb-4">Quiz History</h2>
          {quizHistory.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground"
              data-ocid="progress.empty_state"
            >
              No quizzes taken yet. Try a quiz to see your history here!
            </div>
          ) : (
            <div className="space-y-3">
              {quizHistory.map((quiz, i) => {
                const pct =
                  Number(quiz.total) > 0
                    ? Math.round(
                        (Number(quiz.score) / Number(quiz.total)) * 100,
                      )
                    : 0;
                const date = new Date(
                  Number(quiz.timestamp) / 1_000_000,
                ).toLocaleDateString();
                return (
                  <div
                    key={`${quiz.topicId}-${i}`}
                    className="flex items-center gap-4 p-3 rounded-xl bg-background"
                    data-ocid={`progress.item.${i + 1}`}
                  >
                    {pct >= 70 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground capitalize">
                        {quiz.topicId}
                      </p>
                      <p className="text-xs text-muted-foreground">{date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {Number(quiz.score)}/{Number(quiz.total)}
                      </p>
                      <p
                        className={`text-xs font-medium ${pct >= 70 ? "text-green-600" : "text-red-500"}`}
                      >
                        {pct}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}
