"use client";

import { MessageCircle, RotateCcw, Send, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  doctorFeeLabel,
  doctorInitials,
} from "@/components/modules/doctors/doctor-card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useSendChatMessage } from "@/hooks/chat.hook";
import type { ChatDoctor } from "@/types/chat.type";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  doctors?: ChatDoctor[];
};

const SESSION_KEY = "ph-healthcare-chat-session";

const starters = [
  "Find a cardiologist",
  "Which doctors can I book today?",
  "What does a consultation cost?",
];

function nextMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readSessionId() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(SESSION_KEY);
}

function chatErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: { message?: unknown } }).data;
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }
  }
  return "The assistant could not reply just now. Please try again.";
}

function ChatDoctorCard({ doctor }: { doctor: ChatDoctor }) {
  return (
    <Link
      href={`/doctors/${doctor.id}`}
      className="flex items-center gap-3 rounded-xl border bg-background/70 p-2 transition-colors hover:border-primary/50 hover:bg-background"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
        {doctorInitials(doctor.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {doctor.name}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {doctor.specialization} · {doctorFeeLabel(doctor.consultationFee)}
        </span>
      </span>
    </Link>
  );
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(readSessionId);
  const [error, setError] = useState<string | null>(null);
  const sendMessage = useSendChatMessage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageCount = messages.length;
  const pending = sendMessage.isPending;

  const visible =
    pathname === "/" ||
    pathname === "/doctors" ||
    pathname.startsWith("/doctors/");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    inputRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const node = scrollRef.current;
    if (!node) return;
    if (messageCount > 0 || pending) {
      node.scrollTop = node.scrollHeight;
    }
  }, [open, messageCount, pending]);

  const submitMessage = (text: string) => {
    const content = text.trim();
    if (!content || sendMessage.isPending) return;

    setError(null);
    setMessages((current) => [
      ...current,
      { id: nextMessageId(), role: "user", content },
    ]);
    setDraft("");

    sendMessage.mutate(
      { message: content, ...(sessionId ? { sessionId } : {}) },
      {
        onSuccess: (response) => {
          setSessionId(response.data.sessionId);
          window.sessionStorage.setItem(SESSION_KEY, response.data.sessionId);
          setMessages((current) => [
            ...current,
            {
              id: nextMessageId(),
              role: "assistant",
              content: response.data.answer,
              doctors: response.data.doctors ?? [],
            },
          ]);
        },
        onError: (mutationError) => {
          setError(chatErrorMessage(mutationError));
        },
      },
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMessage(draft);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setDraft("");
    setError(null);
    setSessionId(null);
    window.sessionStorage.removeItem(SESSION_KEY);
    inputRef.current?.focus();
  };

  if (!visible) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open ? (
        <section
          aria-label="PH Healthcare chat assistant"
          className="flex h-[min(32rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-2xl"
        >
          <div className="flex items-center justify-between gap-3 bg-[#06282f] px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0f766e]">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-tight">
                  PH Healthcare assistant
                </p>
                <p className="truncate text-xs text-white/65">
                  Doctors, specialties, and visit help
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {messages.length > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 hover:text-white"
                  aria-label="Start a new chat"
                  onClick={resetConversation}
                >
                  <RotateCcw />
                </Button>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto p-4"
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <div className="rounded-2xl border bg-background/70 p-3 text-sm text-muted-foreground">
                Hi! I&apos;m the PH Healthcare assistant. Ask me about doctors,
                specialties, or booking a visit.
              </div>
            ) : null}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-sm bg-[#0f766e] text-white"
                      : "rounded-bl-sm border bg-background"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.doctors && message.doctors.length > 0 ? (
                    <div className="mt-2 grid gap-2">
                      {message.doctors.map((doctor) => (
                        <ChatDoctorCard key={doctor.id} doctor={doctor} />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {messages.length === 0 ? (
              <div className="flex flex-wrap gap-2">
                {starters.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    className="rounded-full border bg-background px-3 py-1.5 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-muted disabled:opacity-50"
                    disabled={sendMessage.isPending}
                    onClick={() => submitMessage(starter)}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            ) : null}

            {sendMessage.isPending ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border bg-background px-3 py-2 text-sm text-muted-foreground">
                  <Spinner className="size-3.5" />
                  Thinking…
                </div>
              </div>
            ) : null}

            {error ? (
              <p
                role="alert"
                className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </p>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="border-t p-3">
            <div className="flex items-end gap-2">
              <Textarea
                ref={inputRef}
                rows={1}
                value={draft}
                maxLength={1000}
                placeholder="Ask about doctors or booking..."
                aria-label="Message the PH Healthcare assistant"
                className="max-h-24 min-h-10 resize-none py-2"
                disabled={sendMessage.isPending}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                type="submit"
                size="icon"
                className="size-10 shrink-0 rounded-full bg-[#0f766e] text-white hover:bg-[#115e59]"
                disabled={!draft.trim() || sendMessage.isPending}
                aria-label="Send message"
              >
                {sendMessage.isPending ? <Spinner /> : <Send />}
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              General guidance only — not medical advice.
            </p>
          </form>
        </section>
      ) : null}

      <Button
        type="button"
        size="icon"
        className="size-14 rounded-full bg-[#0f766e] text-white shadow-[0_16px_40px_rgba(6,40,47,0.35)] hover:bg-[#115e59]"
        aria-label={
          open ? "Close PH Healthcare chat" : "Chat with PH Healthcare"
        }
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="size-6" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
}
