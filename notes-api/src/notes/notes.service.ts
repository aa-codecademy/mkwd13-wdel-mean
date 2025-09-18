import { Injectable, NotFoundException } from '@nestjs/common';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Note } from './note.interface';
import { CreateNoteDto } from './dtos/create-note.dto';
import { v4 as uuid } from 'uuid';
import { UpdateNoteDto } from './dtos/update-note.dto';

@Injectable()
export class NotesService {
  private NOTES_PATH = join(
    process.cwd(),
    'src',
    'notes',
    'data',
    'notes.json',
  );

  async findAllNotes() {
    const notesJSON = await readFile(this.NOTES_PATH, 'utf-8');

    const notes: Note[] = JSON.parse(notesJSON);

    return notes;
  }

  async findById(id: string) {
    const notes = await this.findAllNotes();

    const foundNote = notes.find((note) => note.id === id);

    if (!foundNote) throw new NotFoundException('Note not found!');

    return foundNote;
  }

  async saveNotes(notes: Note[]) {
    await writeFile(this.NOTES_PATH, JSON.stringify(notes, null, 2), 'utf-8');
  }

  async createNote(createNoteDto: CreateNoteDto) {
    const notes = await this.findAllNotes();

    const newNote: Note = {
      id: uuid(),
      ...createNoteDto,
    };

    notes.push(newNote);

    await this.saveNotes(notes);

    return newNote;
  }

  async updateNote(id: string, updateNoteDto: UpdateNoteDto) {
    const notes = await this.findAllNotes();

    const noteExists = notes.some((note) => note.id === id);

    if (!noteExists) throw new NotFoundException('Note not found!');

    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, ...updateNoteDto } : note,
    );

    await this.saveNotes(updatedNotes);
  }

  async deleteNote(id: string) {
    const notes = await this.findAllNotes();

    const updatedNotes = notes.filter((note) => note.id !== id);

    if (notes.length === updatedNotes.length)
      throw new NotFoundException('Note not found!');

    await this.saveNotes(updatedNotes);
  }
}
