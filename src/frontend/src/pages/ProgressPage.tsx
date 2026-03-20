import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import { BookOpen, LogIn, Target, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAllTopics, useUserProgress } from "../hooks/useQueries";

function formatDate(timestamp: bigint) {
  const ms = Number(timestamp) / 1_000_000;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ms));
}

export default function ProgressPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: progress, isLoading } = useUserProgress();
  const { data: topics } = useAllTopics();

  if (!identity) {
    return (
      <main className="container mx-auto px-4 py-20 max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">
            Track Your Progress
          </h1>
          <p className="text-muted-foreground mb-8">
            Login to save your quiz history, accuracy stats, and see which
            topics you&apos;ve mastered.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="gap-2"
            data-ocid="progress.login_button"
          >
            <LogIn className="w-5 h-5" />
            {isLoggingIn ? "Logging in..." : "Login to Continue"}
          </Button>
        </motion.div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main
        className="container mx-auto px-4 py-10 max-w-3xl"
        data-ocid="progress.loading_state"
      >
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {["a", "b", "c", "d"].map((k) => (
            <Skeleton key={k} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </main>
    );
  }

  const questionsAnswered = Number(progress?.questionsAnswered ?? 0);
  const correctAnswers = Number(progress?.correctAnswers ?? 0);
  const accuracy =
    questionsAnswered > 0
      ? Math.round((correctAnswers / questionsAnswered) * 100)
      : 0;
  const startedTopics = progress?.startedTopics ?? [];
  const quizHistory = progress?.quizHistory ?? [];

  const stats = [
    {
      icon: BookOpen,
      label: "Topics Started",
      value: startedTopics.length,
      color: "text-primary",
    },
    {
      icon: Target,
      label: "Questions Answered",
      value: questionsAnswered,
      color: "text-chart-2",
    },
    {
      icon: Zap,
      label: "Correct Answers",
      value: correctAnswers,
      color: "text-chart-3",
    },
    {
      icon: Trophy,
      label: "Accuracy",
      value: `${accuracy}%`,
      color: "text-chart-5",
    },
  ];

  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">
          Your Progress
        </h1>
        <p className="text-muted-foreground mb-8">
          Track your learning journey across all math topics.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <s.icon className={`w-5 h-5 mb-3 ${s.color}`} />
              <p className="font-display font-bold text-2xl text-foreground">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {questionsAnswered > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-foreground">
                Overall Accuracy
              </h2>
              <Badge variant={accuracy >= 70 ? "default" : "secondary"}>
                {accuracy}%
              </Badge>
            </div>
            <Progress value={accuracy} className="h-2.5" />
            <p className="text-xs text-muted-foreground mt-2">
              {correctAnswers} correct out of {questionsAnswered} answered
            </p>
          </div>
        )}

        {startedTopics.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 mb-8">
            <h2 className="font-display font-semibold text-foreground mb-4">
              Topics Explored
            </h2>
            <div className="flex flex-wrap gap-2">
              {startedTopics.map((tid) => {
                const topic = topics?.find((t) => t.id === tid);
                return (
                  <Link
                    key={tid}
                    to="/topics/$topicId"
                    params={{ topicId: tid }}
                  >
                    <Badge
                      variant="secondary"
                      className="gap-1.5 py-1.5 px-3 cursor-pointer hover:bg-accent"
                    >
                      {topic ? `${topic.icon} ${topic.title}` : tid}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-display font-semibold text-foreground">
              Quiz History
            </h2>
          </div>
          {quizHistory.length === 0 ? (
            <div
              className="p-8 text-center"
              data-ocid="progress.history.empty_state"
            >
              <p className="text-muted-foreground">No quizzes completed yet.</p>
              <Link to="/quiz">
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-border"
                  data-ocid="progress.quiz_button"
                >
                  Take a Quiz
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizHistory.map((result, i) => {
                  const topic = topics?.find((t) => t.id === result.topicId);
                  const pct = Math.round(
                    (Number(result.score) / Number(result.total)) * 100,
                  );
                  return (
                    <TableRow
                      key={`${result.topicId}-${String(result.timestamp)}`}
                      data-ocid={`progress.history.item.${i + 1}`}
                    >
                      <TableCell className="font-medium">
                        {topic
                          ? `${topic.icon} ${topic.title}`
                          : result.topicId}
                      </TableCell>
                      <TableCell>
                        {String(result.score)}/{String(result.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={pct >= 70 ? "default" : "secondary"}>
                          {pct}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(result.timestamp)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </motion.div>
    </main>
  );
}
