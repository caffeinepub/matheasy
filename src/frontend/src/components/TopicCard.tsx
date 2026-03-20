import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { MathTopic } from "../backend.d";

const TOPIC_STYLES: Record<
  string,
  { bg: string; iconBg: string; text: string; border: string }
> = {
  algebra: {
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    text: "text-orange-600",
    border: "border-orange-100",
  },
  geometry: {
    bg: "bg-teal-50",
    iconBg: "bg-teal-100",
    text: "text-teal-600",
    border: "border-teal-100",
  },
  calculus: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-100",
  },
  statistics: {
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    text: "text-green-600",
    border: "border-green-100",
  },
  trigonometry: {
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    text: "text-purple-600",
    border: "border-purple-100",
  },
  functions: {
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    text: "text-yellow-600",
    border: "border-yellow-100",
  },
};

const DEFAULT_STYLE = {
  bg: "bg-gray-50",
  iconBg: "bg-gray-100",
  text: "text-gray-600",
  border: "border-gray-100",
};

interface TopicCardProps {
  topic: MathTopic;
  lessonCount?: number;
  questionCount?: number;
  index?: number;
}

export default function TopicCard({
  topic,
  lessonCount,
  questionCount,
  index = 0,
}: TopicCardProps) {
  const key = topic.id.toLowerCase();
  const style = TOPIC_STYLES[key] ?? DEFAULT_STYLE;

  return (
    <Link
      to="/topics/$topicId"
      params={{ topicId: topic.id }}
      className={`group block rounded-2xl border ${style.border} ${style.bg} p-6 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1`}
      data-ocid={`topics.item.${index + 1}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${style.iconBg} ${style.text} flex items-center justify-center text-2xl font-bold`}
        >
          {topic.icon}
        </div>
        <ArrowRight
          className={`w-4 h-4 ${style.text} opacity-0 group-hover:opacity-100 transition-opacity mt-1`}
        />
      </div>
      <h3 className="font-bold text-lg text-foreground mb-1">{topic.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {topic.description}
      </p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {lessonCount !== undefined && (
          <span className={`font-semibold ${style.text}`}>
            {lessonCount} lessons
          </span>
        )}
        {questionCount !== undefined && (
          <span className={`font-semibold ${style.text}`}>
            {questionCount} questions
          </span>
        )}
      </div>
      <div
        className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${style.text}`}
      >
        Start Topic <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}
