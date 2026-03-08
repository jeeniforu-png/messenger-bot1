import React, { useState, useRef, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateNote } from "@/hooks/use-notes";
import { Button } from "./Button";
import { Plus } from "lucide-react";

export function CreateNote() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const { mutate: createNote, isPending } = useCreateNote();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!title.trim() && !content.trim()) {
          setIsExpanded(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [title, content]);

  const handleSubmit = () => {
    if (!title.trim() && !content.trim()) {
      setIsExpanded(false);
      return;
    }

    createNote(
      { title: title.trim() || "Untitled Note", content: content.trim() },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
          setIsExpanded(false);
        },
      }
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-16 relative z-10" ref={containerRef}>
      <motion.div 
        layout
        className="bg-card rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/60 overflow-hidden transition-all duration-300 focus-within:shadow-[0_8px_40px_rgb(0,0,0,0.08)] focus-within:border-border"
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 pt-5 pb-2 text-lg font-semibold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

        <TextareaAutosize
          placeholder={isExpanded ? "Write your thoughts..." : "Take a note..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onClick={() => setIsExpanded(true)}
          minRows={isExpanded ? 3 : 1}
          className="w-full px-6 py-4 text-base resize-none bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/80 leading-relaxed"
        />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between px-4 pb-4 pt-2"
            >
              <div className="text-xs text-muted-foreground ml-2">
                Press save to store your note
              </div>
              <div className="space-x-2 flex">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setTitle("");
                    setContent("");
                    setIsExpanded(false);
                  }}
                  disabled={isPending}
                >
                  Clear
                </Button>
                <Button onClick={handleSubmit} isLoading={isPending}>
                  Save Note
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
