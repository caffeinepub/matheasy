import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Target, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import TopicCard from "../components/TopicCard";
import { useAllTopics } from "../hooks/useQueries";

const features = [
  {
    icon: BookOpen,
    title: "Structured Lessons",
    desc: "Step-by-step explanations with worked examples for every concept.",
  },
  {
    icon: Target,
    title: "Practice Questions",
    desc: "Instant feedback on every answer with detailed solution breakdowns.",
  },
  {
    icon: Trophy,
    title: "Quiz Mode",
    desc: "Timed quizzes to test your knowledge and track your growth.",
  },
  {
    icon: Zap,
    title: "All Topics",
    desc: "Algebra, Geometry, Calculus, Statistics, Trigonometry, and more.",
  },
];

export default function HomePage() {
  const { data: topics, isLoading } = useAllTopics();

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none" />
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-chart-2/5 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              Learn math at your own pace
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[1.05] tracking-tight mb-6">
              Mathematics, <span className="text-primary">finally</span> made
              easy.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
              Comprehensive lessons, worked examples, and practice questions
              across every major math topic — designed to be clearer than any
              classroom.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/topics">
                <Button
                  size="lg"
                  className="gap-2 font-semibold text-base"
                  data-ocid="home.primary_button"
                >
                  Explore Topics <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/quiz">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 font-semibold text-base border-border hover:bg-secondary"
                  data-ocid="home.secondary_button"
                >
                  Take a Quiz
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className="flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Explore Topics
            </h2>
            <p className="text-muted-foreground">
              Six comprehensive subject areas to master.
            </p>
          </div>
          <Link to="/topics" className="hidden md:block">
            <Button
              variant="ghost"
              className="gap-2 text-primary"
              data-ocid="home.topics_link"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {["a", "b", "c", "d", "e", "f"].map((k) => (
              <Skeleton key={k} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : topics && topics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topics.map((topic, i) => (
              <TopicCard key={topic.id} topic={topic} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16" data-ocid="home.empty_state">
            <p className="text-muted-foreground">
              No topics found. Content is being loaded.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
