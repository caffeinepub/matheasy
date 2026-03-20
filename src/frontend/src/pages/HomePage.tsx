import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import TopicCard from "../components/TopicCard";
import { useAllTopics } from "../hooks/useQueries";

const FALLBACK_TOPICS = [
  {
    id: "algebra",
    title: "Algebra",
    icon: "∑",
    color: "orange",
    description:
      "Master equations, inequalities, polynomials and algebraic structures.",
  },
  {
    id: "geometry",
    title: "Geometry",
    icon: "△",
    color: "teal",
    description: "Explore shapes, theorems, coordinates and spatial reasoning.",
  },
  {
    id: "calculus",
    title: "Calculus",
    icon: "∫",
    color: "blue",
    description:
      "Understand limits, derivatives, integrals and their applications.",
  },
  {
    id: "statistics",
    title: "Statistics",
    icon: "📊",
    color: "green",
    description:
      "Analyze data, probability distributions and statistical inference.",
  },
  {
    id: "trigonometry",
    title: "Trigonometry",
    icon: "sin",
    color: "purple",
    description: "Work with angles, trigonometric functions and identities.",
  },
  {
    id: "functions",
    title: "Functions",
    icon: "f(x)",
    color: "yellow",
    description:
      "Study function types, transformations, and function composition.",
  },
];

export default function HomePage() {
  const { data: topics } = useAllTopics();
  const displayTopics = (
    topics && topics.length > 0 ? topics : FALLBACK_TOPICS
  ).slice(0, 6);

  return (
    <main>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 rounded-full bg-primary/10 text-primary border-0 px-3 py-1">
              🎓 Free for everyone
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] mb-6">
              Master Mathematics.{" "}
              <span className="text-primary">Step-by-Step.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Learn every math topic with clear explanations, worked examples,
              and instant feedback. Better than a classroom — at your own pace.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/topics">
                <Button
                  size="lg"
                  className="rounded-full px-8 text-base font-semibold shadow-lg"
                  data-ocid="hero.primary_button"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/practice">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 text-base font-semibold"
                  data-ocid="hero.secondary_button"
                >
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { icon: BookOpen, label: "Topics Covered", value: "6+" },
                { icon: Target, label: "Practice Questions", value: "500+" },
                { icon: Zap, label: "Step Explanations", value: "100%" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      {value}
                    </div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              <img
                src="/assets/generated/hero-student-math.dim_600x500.png"
                alt="Student learning mathematics"
                className="w-full max-w-lg rounded-3xl shadow-card"
              />
              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-card p-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-semibold text-foreground">
                  Correct! Great job
                </span>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-card p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Quiz Progress
                </div>
                <div className="text-sm font-bold text-foreground mb-1">
                  8/10 Questions
                </div>
                <Progress value={80} className="w-24 h-2" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="bg-white py-20" id="topics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl font-extrabold text-foreground mb-2">
                Explore Mathematics Topics
              </h2>
              <p className="text-muted-foreground">
                From basics to advanced — every topic with detailed lessons and
                practice.
              </p>
            </div>
            <Link to="/topics" className="hidden sm:block">
              <Button
                variant="outline"
                className="rounded-full"
                data-ocid="topics.secondary_button"
              >
                All Topics <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTopics.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <TopicCard topic={topic as any} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold text-foreground mb-2">
              Practice & Master
            </h2>
            <p className="text-muted-foreground">
              Interactive questions with instant feedback and detailed
              solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Practice card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3 bg-white rounded-2xl shadow-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-foreground">
                  Dynamic Practice Questions
                </h3>
                <Badge className="bg-primary/10 text-primary border-0">
                  Algebra
                </Badge>
              </div>
              <div className="bg-background rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-foreground mb-3">
                  Solve for x: 2x + 5 = 13
                </p>
                <div className="space-y-2">
                  {["x = 3", "x = 4", "x = 9", "x = 18"].map((opt, i) => (
                    <div
                      key={opt}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-sm cursor-default ${
                        i === 1
                          ? "border-green-400 bg-green-50 text-green-700 font-medium"
                          : "border-border bg-white text-muted-foreground"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                      {i === 1 && (
                        <CheckCircle2 className="w-4 h-4 ml-auto text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                <p className="text-sm text-green-700 font-medium">
                  ✓ Correct! 2x + 5 = 13 → 2x = 8 → x = 4
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/practice" className="flex-1">
                  <Button
                    className="w-full rounded-lg"
                    data-ocid="practice.primary_button"
                  >
                    Next Question
                  </Button>
                </Link>
                <Button variant="outline" className="rounded-lg">
                  Detailed Solution
                </Button>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>8 / 15 Questions Completed</span>
                </div>
                <Progress value={53} className="h-2" />
              </div>
            </motion.div>

            {/* Quiz card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 bg-navy rounded-2xl shadow-card p-6 text-white flex flex-col"
            >
              <h3 className="font-bold text-lg mb-2">Interactive Quiz Mode</h3>
              <p className="text-sm text-white/60 mb-6">
                Test your knowledge with timed quizzes. Track your score and
                review mistakes.
              </p>
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock className="w-10 h-10 text-primary" />
                </div>
                <Link to="/quiz" className="w-full">
                  <Button
                    className="w-full rounded-full"
                    data-ocid="quiz.primary_button"
                  >
                    Launch Daily Quiz
                  </Button>
                </Link>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: Clock, label: "60s", sub: "per question" },
                  { icon: Target, label: "10", sub: "questions" },
                  { icon: Trophy, label: "100%", sub: "best score" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="text-center">
                    <Icon className="w-4 h-4 text-white/50 mx-auto mb-1" />
                    <div className="text-sm font-bold">{label}</div>
                    <div className="text-xs text-white/50">{sub}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
