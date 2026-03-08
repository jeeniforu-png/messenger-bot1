import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNotes } from "@/hooks/use-notes";
import { CreateNote } from "@/components/CreateNote";
import { NoteCard } from "@/components/NoteCard";
import { NoteDialog } from "@/components/NoteDialog";
import { type NoteResponse } from "@shared/routes";
import { Loader2, Feather } from "lucide-react";

export default function Home() {
  const { data: notes, isLoading, error } = useNotes();
  
  const [selectedNote, setSelectedNote] = useState<NoteResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = (note: NoteResponse) => {
    setSelectedNote(note);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // slight delay to let exit animation finish before clearing data
    setTimeout(() => setSelectedNote(null), 200);
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-foreground/10">
      
      {/* Decorative ambient background gradient */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-foreground/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-tl from-foreground/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        
        {/* Header Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-editorial mb-4">
            Notes.
          </h1>
          <p className="text-muted-foreground font-medium">Capture your thoughts, beautifully.</p>
        </header>

        {/* Creation Input */}
        <CreateNote />

        {/* Content Area */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-50" />
              <p className="text-sm font-medium">Loading your notes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-destructive bg-destructive/5 rounded-2xl border border-destructive/10">
              <p className="font-semibold">Oops! Failed to load notes.</p>
              <p className="text-sm opacity-80 mt-1">Please try refreshing the page.</p>
            </div>
          ) : !notes || notes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center px-4"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
                <Feather className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No notes yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Your mind is a blank canvas. Start typing above to capture your first brilliant idea.
              </p>
            </motion.div>
          ) : (
            /* CSS Columns Masonry layout for a dynamic, pinterest-like grid */
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {notes.map((note) => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onClick={handleOpenDialog} 
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit/View Dialog */}
      <NoteDialog 
        note={selectedNote} 
        isOpen={isDialogOpen} 
        onClose={handleCloseDialog} 
      />
    </div>
  );
}
