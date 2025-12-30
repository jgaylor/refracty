import { createClient } from './server';
import { getUser } from './auth';

export interface Person {
  id: string;
  user_id: string;
  name: string;
  vibe_summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  person_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface PersonWithNote extends Person {
  first_note?: Note | null;
}

export interface CreatePersonInput {
  name: string;
  vibe_summary?: string | null;
  first_note?: string | null;
}

/**
 * Get all people for the current user
 */
export async function getPeople(): Promise<PersonWithNote[]> {
  const user = await getUser();
  if (!user) {
    return [];
  }

  const supabase = await createClient();
  
  // Fetch people for the current user
  const { data: people, error: peopleError } = await supabase
    .from('people')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (peopleError) {
    console.error('Error fetching people:', peopleError);
    return [];
  }

  if (!people || people.length === 0) {
    return [];
  }

  // Fetch the first note for each person
  const personIds = people.map(p => p.id);
  const { data: notes, error: notesError } = await supabase
    .from('notes')
    .select('*')
    .in('person_id', personIds)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (notesError) {
    console.error('Error fetching notes:', notesError);
    // Return people without notes if notes fetch fails
    return people.map(p => ({ ...p, first_note: null }));
  }

  // Group notes by person_id and get the first one
  const notesByPersonId = new Map<string, Note>();
  notes?.forEach(note => {
    if (!notesByPersonId.has(note.person_id)) {
      notesByPersonId.set(note.person_id, note);
    }
  });

  // Combine people with their first note
  return people.map(person => ({
    ...person,
    first_note: notesByPersonId.get(person.id) || null,
  }));
}

/**
 * Get a single person by ID
 */
export async function getPersonById(id: string): Promise<Person | null> {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching person:', error);
    return null;
  }

  return data;
}

/**
 * Get all notes for a specific person
 */
export async function getNotesByPerson(personId: string): Promise<Note[]> {
  const user = await getUser();
  if (!user) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('person_id', personId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notes:', error);
    return [];
  }

  return data || [];
}

/**
 * Create a new person and optionally a first note
 */
export async function createPerson(
  input: CreatePersonInput
): Promise<{ success: boolean; person?: Person; error?: string }> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }

  if (!input.name || input.name.trim().length === 0) {
    return { success: false, error: 'Name is required' };
  }

  const supabase = await createClient();

  // Create the person
  const { data: person, error: personError } = await supabase
    .from('people')
    .insert({
      user_id: user.id,
      name: input.name.trim(),
      vibe_summary: input.vibe_summary?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (personError) {
    console.error('Error creating person:', personError);
    return { success: false, error: personError.message };
  }

  // Create the first note if provided
  if (input.first_note && input.first_note.trim().length > 0) {
    const { error: noteError } = await supabase
      .from('notes')
      .insert({
        person_id: person.id,
        user_id: user.id,
        content: input.first_note.trim(),
        updated_at: new Date().toISOString(),
      });

    if (noteError) {
      console.error('Error creating note:', noteError);
      // Person was created but note failed - still return success with person
      return { success: true, person, error: 'Person created but note failed to save' };
    }
  }

  return { success: true, person };
}

