import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  useLessonsForTopic,
  useMarkTopicStarted,
  usePracticeQuestions,
} from "../hooks/useQueries";

const SKELETON_KEYS = ["sk-l-1", "sk-l-2", "sk-l-3", "sk-l-4"];

const TOPIC_STYLES: Record<
  string,
  { bg: string; text: string; badge: string }
> = {
  algebra: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
  },
  geometry: {
    bg: "bg-teal-50",
    text: "text-teal-600",
    badge: "bg-teal-100 text-teal-700",
  },
  calculus: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  statistics: {
    bg: "bg-green-50",
    text: "text-green-600",
    badge: "bg-green-100 text-green-700",
  },
  trigonometry: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
  },
  functions: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    badge: "bg-yellow-100 text-yellow-700",
  },
};

export default function TopicDetailPage() {
  const { topicId } = useParams({ from: "/topics/$topicId" });
  const { data: lessons, isLoading: lessonsLoading } =
    useLessonsForTopic(topicId);
  const { data: questions, isLoading: questionsLoading } =
    usePracticeQuestions(topicId);
  const markStarted = useMarkTopicStarted();
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [expandedExample, setExpandedExample] = useState<string | null>(null);

  const style = TOPIC_STYLES[topicId] ?? {
    bg: "bg-gray-50",
    text: "text-gray-600",
    badge: "bg-gray-100 text-gray-700",
  };

  const handleStartTopic = () => {
    markStarted.mutate(topicId);
  };

  const toggleLesson = (id: string) => {
    setExpandedLesson((prev) => (prev !== id ? id : null));
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/topics"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        data-ocid="topic.link"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Topics
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-2xl ${style.bg} p-8 mb-8`}
      >
        <Badge className={`${style.badge} border-0 mb-3`}>{topicId}</Badge>
        <h1 className="text-4xl font-extrabold text-foreground mb-2 capitalize">
          {topicId}
        </h1>
        <p className="text-muted-foreground mb-6">
          Comprehensive lessons with worked examples and practice questions to
          master {topicId}.
        </p>
        <Button
          onClick={handleStartTopic}
          className="rounded-full"
          data-ocid="topic.primary_button"
        >
          <BookOpen className="w-4 h-4 mr-2" /> Start Learning
        </Button>
      </motion.div>

      {/* Lessons */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-4">Lessons</h2>
        {lessonsLoading ? (
          <div className="space-y-3" data-ocid="lessons.loading_state">
            {SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : lessons && lessons.length > 0 ? (
          <div className="space-y-3">
            {lessons.map((lesson, idx) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-border shadow-xs overflow-hidden"
                data-ocid={`lessons.item.${idx + 1}`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-accent transition-colors"
                  onClick={() => toggleLesson(lesson.id)}
                  data-ocid={`lessons.toggle.${idx + 1}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full ${style.bg} ${style.text} flex items-center justify-center text-sm font-bold`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-foreground">
                      {lesson.title}
                    </span>
                  </div>
                  {expandedLesson === lesson.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedLesson === lesson.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 border-t border-border">
                        <p className="text-sm text-muted-foreground leading-relaxed mt-4 mb-5">
                          {lesson.explanation}
                        </p>
                        {lesson.examples && lesson.examples.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-foreground mb-3">
                              Worked Examples
                            </h4>
                            <div className="space-y-3">
                              {lesson.examples.map((ex, ei) => (
                                <div
                                  key={ex.id}
                                  className={`rounded-xl ${style.bg} p-4`}
                                >
                                  <button
                                    type="button"
                                    className="w-full text-left"
                                    onClick={() =>
                                      setExpandedExample(
                                        expandedExample === ex.id
                                          ? null
                                          : ex.id,
                                      )
                                    }
                                  >
                                    <p className="text-sm font-semibold text-foreground">
                                      Example {ei + 1}: {ex.problem}
                                    </p>
                                  </button>
                                  <AnimatePresence>
                                    {expandedExample === ex.id && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                      >
                                        <p className="text-sm text-muted-foreground mt-2 pt-2 border-t border-border/50">
                                          {ex.solution}
                                        </p>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                  {expandedExample !== ex.id && (
                                    <p className={`text-xs ${style.text} mt-1`}>
                                      Click to see solution →
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="lessons.empty_state"
          >
            No lessons available yet for this topic.
          </div>
        )}
      </section>

      {/* Practice Questions Preview */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Practice Questions
        </h2>
        {questionsLoading ? (
          <Skeleton
            className="h-20 rounded-xl"
            data-ocid="practice.loading_state"
          />
        ) : questions && questions.length > 0 ? (
          <div className="bg-white rounded-2xl border border-border shadow-xs p-6">
            <p className="text-muted-foreground mb-4">
              {questions.length} practice questions available for {topicId}.
            </p>
            <Link to="/practice" search={{ topic: topicId }}>
              <Button
                className="rounded-full"
                data-ocid="practice.primary_button"
              >
                Try a Question
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border shadow-xs p-6">
            <p className="text-muted-foreground mb-4">
              Practice questions for this topic coming soon.
            </p>
            <Link to="/practice">
              <Button
                className="rounded-full"
                data-ocid="practice.primary_button"
              >
                Browse All Questions
              </Button>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
