import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, ChevronRight, Lightbulb } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllTopics,
  useLessonsForTopic,
  useMarkTopicStarted,
} from "../hooks/useQueries";

export default function TopicDetailPage() {
  const { topicId } = useParams({ from: "/topics/$topicId" });
  const { data: topics } = useAllTopics();
  const { data: lessons, isLoading } = useLessonsForTopic(topicId);
  const { identity } = useInternetIdentity();
  const { mutate: markStarted } = useMarkTopicStarted();
  const markedRef = useRef(false);

  const topic = topics?.find((t) => t.id === topicId);

  useEffect(() => {
    if (identity && topicId && !markedRef.current) {
      markedRef.current = true;
      markStarted(topicId);
    }
  }, [identity, topicId, markStarted]);

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <Link to="/topics">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground mb-6 -ml-2"
          data-ocid="topic.back_button"
        >
          <ArrowLeft className="w-4 h-4" /> All Topics
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        {topic ? (
          <>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{topic.icon}</span>
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                  {topic.title}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {topic.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/practice" search={{ topicId }}>
                <Button className="gap-2" data-ocid="topic.practice_button">
                  <BookOpen className="w-4 h-4" /> Practice Questions
                </Button>
              </Link>
              <Link to="/quiz" search={{ topicId }}>
                <Button
                  variant="outline"
                  className="gap-2 border-border"
                  data-ocid="topic.quiz_button"
                >
                  Take a Quiz <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <Skeleton className="h-24 rounded-2xl" />
        )}
      </motion.div>

      <section>
        <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" /> Lessons
        </h2>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {["a", "b", "c"].map((k) => (
              <Skeleton key={k} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : lessons && lessons.length > 0 ? (
          <div className="flex flex-col gap-4">
            {lessons.map((lesson, li) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: li * 0.08, duration: 0.4 }}
                className="rounded-2xl border border-border bg-card p-6"
                data-ocid={`topic.lesson.item.${li + 1}`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-display font-semibold text-xl text-foreground">
                    {lesson.title}
                  </h3>
                  <Badge variant="secondary" className="shrink-0">
                    Lesson {li + 1}
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {lesson.explanation}
                </p>

                {lesson.examples.length > 0 && (
                  <Accordion type="multiple">
                    {lesson.examples.map((ex, ei) => (
                      <AccordionItem
                        key={ex.id}
                        value={ex.id}
                        className="border-border"
                      >
                        <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                          Example {ei + 1}:{" "}
                          {ex.problem.length > 60
                            ? `${ex.problem.slice(0, 60)}…`
                            : ex.problem}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-3 pt-2">
                            <div className="rounded-xl bg-secondary p-4">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                Problem
                              </p>
                              <p className="text-foreground">{ex.problem}</p>
                            </div>
                            <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
                              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                                Solution
                              </p>
                              <p className="text-foreground">{ex.solution}</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="topic.lessons.empty_state"
          >
            No lessons available for this topic yet.
          </div>
        )}
      </section>
    </main>
  );
}
