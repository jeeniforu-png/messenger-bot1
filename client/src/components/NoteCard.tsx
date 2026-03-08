import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { type NoteResponse } from "@shared/routes";

interface NoteCardProps {
  note: NoteResponse;
  onClick: (note: NoteResponse) => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(note)}
      className="group relative flex flex-col w-full bg-card rounded-2xl border border-border/60 p-5 sm:p-6 cursor-pointer hover:border-border hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] mb-6 break-inside-avoid"
    >
      {note.title && (
        <h3 className="text-lg font-bold text-foreground mb-2 font-editorial leading-tight line-clamp-2">
          {note.title}
        </h3>
      )}
      
      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap line-clamp-6">
        {note.content}
      </p>

      <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
        <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
          {format(new Date(note.createdAt!), "MMM d")}
        </span>
      </div>
    </motion.div>
  );
}
