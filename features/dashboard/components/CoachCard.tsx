import { BrainCircuit } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardCoachMessage } from "@/features/dashboard/types";

const toneClasses: Record<DashboardCoachMessage["tone"], string> = {
  positive: "border-emerald-400/20 bg-emerald-400/5",
  warning: "border-amber-400/20 bg-amber-400/5",
  neutral: "border-slate-800 bg-slate-950",
};

export function CoachCard({ messages }: { messages: DashboardCoachMessage[] }) {
  return (
    <Card className="border-slate-800 bg-slate-900 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-emerald-400" />
          Coach Fit33
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`rounded-xl border p-4 ${toneClasses[message.tone]}`}
            >
              <p className="font-semibold">{message.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                {message.message}
              </p>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
