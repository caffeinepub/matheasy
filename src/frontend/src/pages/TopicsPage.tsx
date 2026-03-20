import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import TopicCard from "../components/TopicCard";
import { useAllTopics } from "../hooks/useQueries";

export default function TopicsPage() {
  const { data: topics, isLoading } = useAllTopics();

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
          Math Topics
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl">
          Choose a subject to explore lessons, worked examples, and practice
          questions.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <Skeleton key={k} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : topics && topics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((topic, i) => (
            <TopicCard key={topic.id} topic={topic} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24" data-ocid="topics.empty_state">
          <p className="text-muted-foreground text-lg">
            No topics available yet.
          </p>
        </div>
      )}
    </main>
  );
}
