import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import { format } from "date-fns";
import { X, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { useUpdateNote, useDeleteNote } from "@/hooks/use-notes";
import { type NoteResponse } from "@shared/routes";

interface NoteDialogProps {
  note: NoteResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NoteDialog({ note, isOpen, onClose }: NoteDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();

  useEffect(() => {
    if (note && isOpen) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSaveAndClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, title, content]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleSaveAndClose = () => {
    if (!note) return;
    
    const titleChanged = title !== note.title;
    const contentChanged = content !== note.content;
    
    if (titleChanged || contentChanged) {
      updateNote(
        { id: note.id, title: title.trim() || "Untitled Note", content },
        { onSuccess: onClose }
      );
    } else {
      onClose();
    }
  };

  const handleDelete = () => {
    if (!note) return;
    deleteNote(note.id, { onSuccess: onClose });
  };

  if (!note) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSaveAndClose}
            className="fixed inset-0 z-40 bg-foreground/5 backdrop-blur-sm"
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-card pointer-events-auto rounded-3xl shadow-2xl shadow-black/10 border border-border overflow-hidden"
            >
              {/* Header actions */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-border/50">
                <span className="text-xs font-medium text-muted-foreground px-2">
                  Edited {format(new Date(note.createdAt!), "MMM d, yyyy")}
                </span>
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleDelete}
                    disabled={isDeleting || isUpdating}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleSaveAndClose}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full text-3xl sm:text-4xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/30 mb-6 font-editorial"
                />
                
                <TextareaAutosize
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start typing..."
                  minRows={8}
                  className="w-full text-base sm:text-lg resize-none bg-transparent border-none outline-none text-foreground/90 placeholder:text-muted-foreground/50 leading-relaxed"
                />
              </div>
              
              {/* Footer Save Area */}
              <div className="px-6 py-4 border-t border-border/50 flex justify-end bg-secondary/30">
                 <Button onClick={handleSaveAndClose} isLoading={isUpdating}>
                    Done
                 </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
