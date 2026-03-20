import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Lesson,
  MathTopic,
  PracticeQuestion,
  UserProgress,
} from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useAllTopics() {
  const { actor, isFetching } = useActor();
  return useQuery<MathTopic[]>({
    queryKey: ["topics"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTopics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLessonsForTopic(topicId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Lesson[]>({
    queryKey: ["lessons", topicId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLessonsForTopic(topicId);
    },
    enabled: !!actor && !isFetching && !!topicId,
  });
}

export function usePracticeQuestions(topicId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<PracticeQuestion[]>({
    queryKey: ["practice", topicId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPracticeQuestionsForTopic(topicId);
    },
    enabled: !!actor && !isFetching && !!topicId,
  });
}

export function useQuizQuestions(topicId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<PracticeQuestion[]>({
    queryKey: ["quiz", topicId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuizQuestions(topicId);
    },
    enabled: !!actor && !isFetching && !!topicId,
    staleTime: 0,
  });
}

export function useUserProgress() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<UserProgress | null>({
    queryKey: ["progress", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return actor.getUserProgress(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<string>({
    queryKey: ["userRole", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return "guest";
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitAnswer() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      questionId,
      selectedOption,
    }: { questionId: string; selectedOption: number }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitAnswer(questionId, BigInt(selectedOption));
    },
  });
}

export function useRecordQuizResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      topicId,
      score,
      total,
    }: { topicId: string; score: number; total: number }) => {
      if (!actor) throw new Error("Not connected");
      return actor.recordQuizResult(topicId, BigInt(score), BigInt(total));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}

export function useMarkTopicStarted() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (topicId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.markTopicStarted(topicId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}

export function useSeedBackend() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.seedBackend();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
