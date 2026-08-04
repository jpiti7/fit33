export type CoachChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type CoachChatResponse = {
  answer: string;
  suggestions: string[];
  source: "rules" | "ai";
};
