import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  try {
    const existingItems = await storage.getNotes();
    if (existingItems.length === 0) {
      await storage.createNote({ title: "Welcome to Notes", content: "This is your first note. Try creating more!" });
      await storage.createNote({ title: "Meeting Notes", content: "Discussed Q4 roadmap and team assignments." });
      await storage.createNote({ title: "Ideas", content: "- Build a recipe app\n- Learn TypeScript\n- Read more books" });
    }
  } catch (e) {
    console.error("Failed to seed database, table might not exist yet:", e);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the database
  await seedDatabase();

  app.get(api.notes.list.path, async (req, res) => {
    const notes = await storage.getNotes();
    res.json(notes);
  });

  app.get(api.notes.get.path, async (req, res) => {
    const note = await storage.getNote(Number(req.params.id));
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  });

  app.post(api.notes.create.path, async (req, res) => {
    try {
      const input = api.notes.create.input.parse(req.body);
      const note = await storage.createNote(input);
      res.status(201).json(note);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.notes.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.notes.update.input.parse(req.body);
      const updated = await storage.updateNote(id, input);
      if (!updated) {
        return res.status(404).json({ message: 'Note not found' });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.notes.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteNote(id);
    res.status(204).send();
  });

  return httpServer;
}
