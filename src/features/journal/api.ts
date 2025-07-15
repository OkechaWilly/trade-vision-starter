import { supabase } from "@/lib/supabaseClient";
import type { JournalEntry, NewJournalEntry, UpdateJournalEntry } from "@/lib/database.types";

export const JournalAPI = {
  /**
   * Get all journal entries for a specific user
   */
  getEntries: async (userId: string) => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as JournalEntry[];
  },

  /**
   * Get a single journal entry by ID
   */
  getEntry: async (id: string, userId: string) => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as JournalEntry;
  },

  /**
   * Create a new journal entry
   */
  createEntry: async (entry: Omit<NewJournalEntry, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        ...entry,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as JournalEntry;
  },

  /**
   * Update an existing journal entry
   */
  updateEntry: async (id: string, updates: UpdateJournalEntry) => {
    const { data, error } = await supabase
      .from('journal_entries')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as JournalEntry;
  },

  /**
   * Delete a journal entry
   */
  deleteEntry: async (id: string, userId: string) => {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  /**
   * Search journal entries by content or title
   */
  searchEntries: async (userId: string, query: string) => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as JournalEntry[];
  },

  /**
   * Get entries by mood
   */
  getEntriesByMood: async (userId: string, mood: string) => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('mood', mood)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as JournalEntry[];
  },

  /**
   * Get entries by tags
   */
  getEntriesByTag: async (userId: string, tag: string) => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .contains('tags', [tag])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as JournalEntry[];
  },

  /**
   * Get paginated journal entries for a user
   */
  getPaginatedEntries: async (
    userId: string,
    { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {}
  ) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('journal_entries')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return {
      data: data as JournalEntry[],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  },

  /**
   * Create a new journal entry with validation
   */
  validateAndCreateEntry: async (entry: unknown) => {
    const { entrySchema } = await import('./schema');
    const parsed = entrySchema.parse(entry);
    return JournalAPI.createEntry(parsed);
  },

  /**
   * Update an existing journal entry with validation
   */
  validateAndUpdateEntry: async (id: string, updates: unknown) => {
    const { updateEntrySchema } = await import('./schema');
    const parsed = updateEntrySchema.parse(updates);
    return JournalAPI.updateEntry(id, parsed);
  }
};