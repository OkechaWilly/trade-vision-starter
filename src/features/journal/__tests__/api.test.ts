import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JournalAPI } from '../api';
import { supabase } from '@/lib/supabaseClient';

// Mock the supabase client
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const mockSupabase = vi.mocked(supabase);

describe('JournalAPI', () => {
  const mockUserId = 'user-123';
  const mockEntryId = 'entry-456';
  
  const mockEntry = {
    id: mockEntryId,
    user_id: mockUserId,
    title: 'Test Entry',
    content: 'This is a test journal entry',
    mood: 'happy' as const,
    tags: ['test', 'journal'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
  };

  const mockChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.from.mockReturnValue(mockChain as any);
  });

  describe('getEntries', () => {
    it('should fetch all entries for a user', async () => {
      mockChain.order.mockResolvedValue({ data: [mockEntry], error: null });

      const result = await JournalAPI.getEntries(mockUserId);

      expect(mockSupabase.from).toHaveBeenCalledWith('journal_entries');
      expect(mockChain.select).toHaveBeenCalledWith('*');
      expect(mockChain.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(mockChain.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual([mockEntry]);
    });

    it('should throw error when query fails', async () => {
      const error = new Error('Database error');
      mockChain.order.mockResolvedValue({ data: null, error });

      await expect(JournalAPI.getEntries(mockUserId)).rejects.toThrow('Database error');
    });
  });

  describe('createEntry', () => {
    it('should create a new journal entry', async () => {
      const newEntry = {
        user_id: mockUserId,
        title: 'New Entry',
        content: 'New content',
        mood: 'neutral' as const,
        tags: ['new'],
      };

      mockChain.single.mockResolvedValue({ data: mockEntry, error: null });

      const result = await JournalAPI.createEntry(newEntry);

      expect(mockSupabase.from).toHaveBeenCalledWith('journal_entries');
      expect(mockChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          ...newEntry,
          updated_at: expect.any(String),
        })
      );
      expect(result).toEqual(mockEntry);
    });
  });

  describe('updateEntry', () => {
    it('should update an existing journal entry', async () => {
      const updates = { title: 'Updated Title', content: 'Updated content' };
      mockChain.single.mockResolvedValue({ data: { ...mockEntry, ...updates }, error: null });

      const result = await JournalAPI.updateEntry(mockEntryId, updates);

      expect(mockSupabase.from).toHaveBeenCalledWith('journal_entries');
      expect(mockChain.update).toHaveBeenCalledWith(
        expect.objectContaining({
          ...updates,
          updated_at: expect.any(String),
        })
      );
      expect(mockChain.eq).toHaveBeenCalledWith('id', mockEntryId);
      expect(result).toEqual({ ...mockEntry, ...updates });
    });
  });

  describe('deleteEntry', () => {
    it('should delete a journal entry', async () => {
      mockChain.eq.mockResolvedValue({ error: null });

      const result = await JournalAPI.deleteEntry(mockEntryId, mockUserId);

      expect(mockSupabase.from).toHaveBeenCalledWith('journal_entries');
      expect(mockChain.delete).toHaveBeenCalled();
      expect(mockChain.eq).toHaveBeenCalledWith('id', mockEntryId);
      expect(mockChain.eq).toHaveBeenCalledWith('user_id', mockUserId);
      expect(result).toBe(true);
    });
  });

  describe('searchEntries', () => {
    it('should search entries by query', async () => {
      const query = 'test';
      mockChain.order.mockResolvedValue({ data: [mockEntry], error: null });

      const result = await JournalAPI.searchEntries(mockUserId, query);

      expect(mockChain.or).toHaveBeenCalledWith(`title.ilike.%${query}%,content.ilike.%${query}%`);
      expect(result).toEqual([mockEntry]);
    });
  });

  describe('getEntriesByMood', () => {
    it('should get entries by mood', async () => {
      const mood = 'happy';
      mockChain.order.mockResolvedValue({ data: [mockEntry], error: null });

      const result = await JournalAPI.getEntriesByMood(mockUserId, mood);

      expect(mockChain.eq).toHaveBeenCalledWith('mood', mood);
      expect(result).toEqual([mockEntry]);
    });
  });

  describe('getEntriesByTag', () => {
    it('should get entries by tag', async () => {
      const tag = 'test';
      mockChain.order.mockResolvedValue({ data: [mockEntry], error: null });

      const result = await JournalAPI.getEntriesByTag(mockUserId, tag);

      expect(mockChain.contains).toHaveBeenCalledWith('tags', [tag]);
      expect(result).toEqual([mockEntry]);
    });
  });
});