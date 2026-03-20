import { Skeleton } from "@/components/ui/skeleton";
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

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

const TOPIC_LESSON_COUNTS: Record<string, number> = {
  algebra: 8,
  geometry: 7,
  calculus: 10,
  statistics: 6,
  trigonometry: 7,
  functions: 5,
};
const TOPIC_QUESTION_COUNTS: Record<string, number> = {
  algebra: 85,
  geometry: 72,
  calculus: 96,
  statistics: 63,
  trigonometry: 74,
  functions: 58,
};

export default function TopicsPage() {
  const { data: topics, isLoading } = useAllTopics();
  const displayTopics = topics && topics.length > 0 ? topics : FALLBACK_TOPICS;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-extrabold text-foreground mb-3">
          Mathematics Topics
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Explore all topics with structured lessons, worked examples, and
          hundreds of practice questions.
        </p>
      </motion.div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="topics.loading_state"
        >
          {SKELETON_KEYS.map((k) => (
            <Skeleton key={k} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="topics.list"
        >
          {displayTopics.map((topic, i) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <TopicCard
                topic={topic as any}
                lessonCount={TOPIC_LESSON_COUNTS[topic.id] ?? 5}
                questionCount={TOPIC_QUESTION_COUNTS[topic.id] ?? 50}
                index={i}
              />
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
