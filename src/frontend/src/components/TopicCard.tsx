import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { MathTopic } from "../backend.d";

// Map backend color strings to OKLCH vivid colors
const colorMap: Record<
  string,
  { bg: string; text: string; border: string; glow: string }
> = {
  blue: {
    bg: "oklch(0.62 0.22 265 / 0.15)",
    text: "oklch(0.72 0.2 265)",
    border: "oklch(0.62 0.22 265 / 0.3)",
    glow: "oklch(0.62 0.22 265 / 0.3)",
  },
  green: {
    bg: "oklch(0.65 0.2 145 / 0.15)",
    text: "oklch(0.72 0.18 145)",
    border: "oklch(0.65 0.2 145 / 0.3)",
    glow: "oklch(0.65 0.2 145 / 0.3)",
  },
  orange: {
    bg: "oklch(0.68 0.2 55 / 0.15)",
    text: "oklch(0.75 0.18 55)",
    border: "oklch(0.68 0.2 55 / 0.3)",
    glow: "oklch(0.68 0.2 55 / 0.3)",
  },
  cyan: {
    bg: "oklch(0.65 0.18 200 / 0.15)",
    text: "oklch(0.72 0.16 200)",
    border: "oklch(0.65 0.18 200 / 0.3)",
    glow: "oklch(0.65 0.18 200 / 0.3)",
  },
  pink: {
    bg: "oklch(0.65 0.2 330 / 0.15)",
    text: "oklch(0.72 0.18 330)",
    border: "oklch(0.65 0.2 330 / 0.3)",
    glow: "oklch(0.65 0.2 330 / 0.3)",
  },
  yellow: {
    bg: "oklch(0.78 0.18 88 / 0.15)",
    text: "oklch(0.82 0.16 88)",
    border: "oklch(0.78 0.18 88 / 0.3)",
    glow: "oklch(0.78 0.18 88 / 0.3)",
  },
  purple: {
    bg: "oklch(0.6 0.22 300 / 0.15)",
    text: "oklch(0.7 0.2 300)",
    border: "oklch(0.6 0.22 300 / 0.3)",
    glow: "oklch(0.6 0.22 300 / 0.3)",
  },
  red: {
    bg: "oklch(0.6 0.22 25 / 0.15)",
    text: "oklch(0.7 0.2 25)",
    border: "oklch(0.6 0.22 25 / 0.3)",
    glow: "oklch(0.6 0.22 25 / 0.3)",
  },
};

const defaultColor = colorMap.blue;

function getColor(color: string) {
  const key = color?.toLowerCase();
  return colorMap[key] || defaultColor;
}

interface TopicCardProps {
  topic: MathTopic;
  index?: number;
}

export default function TopicCard({ topic, index = 0 }: TopicCardProps) {
  const c = getColor(topic.color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
    >
      <Link
        to="/topics/$topicId"
        params={{ topicId: topic.id }}
        data-ocid={`topics.item.${index + 1}`}
      >
        <div
          className="group relative rounded-2xl border p-6 h-full transition-all duration-300 cursor-pointer hover:-translate-y-1"
          style={{
            background: c.bg,
            borderColor: c.border,
            boxShadow: `0 4px 24px -8px ${c.glow}`,
          }}
        >
          {/* Icon */}
          <div
            className="text-4xl mb-4 w-14 h-14 rounded-xl flex items-center justify-center"
            style={{
              background: c.bg,
              borderColor: c.border,
              border: `1px solid ${c.border}`,
            }}
          >
            {topic.icon}
          </div>

          {/* Title */}
          <h3
            className="font-display font-bold text-xl mb-2 group-hover:opacity-90 transition-opacity"
            style={{ color: c.text }}
          >
            {topic.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {topic.description}
          </p>

          {/* Arrow */}
          <div
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0"
            style={{ color: c.text }}
          >
            →
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
