import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { JournalAPI } from '../api';
import type { NewJournalEntry, UpdateJournalEntry } from '@/lib/database.types';
import { toast } from '@/hooks/use-toast';

const QUERY_KEYS = {
  entries: (userId: string) => ['journal-entries', userId],
  entry: (id: string, userId: string) => ['journal-entry', id, userId],
  searchEntries: (userId: string, query: string) => ['journal-search', userId, query],
  entriesByMood: (userId: string, mood: string) => ['journal-mood', userId, mood],
  entriesByTag: (userId: string, tag: string) => ['journal-tag', userId, tag],
};

export const useJournalEntries = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: QUERY_KEYS.entries(user?.id || ''),
    queryFn: () => JournalAPI.getEntries(user!.id),
    enabled: !!user?.id,
  });
};

export const useJournalEntry = (id: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: QUERY_KEYS.entry(id, user?.id || ''),
    queryFn: () => JournalAPI.getEntry(id, user!.id),
    enabled: !!user?.id && !!id,
  });
};

export const useCreateJournalEntry = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entry: Omit<NewJournalEntry, 'user_id'>) =>
      JournalAPI.createEntry({ ...entry, user_id: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.entries(user!.id) });
      toast({
        title: "Success",
        description: "Journal entry created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create journal entry",
        variant: "destructive",
      });
      console.error('Create entry error:', error);
    },
  });
};

export const useUpdateJournalEntry = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateJournalEntry }) =>
      JournalAPI.updateEntry(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.entries(user!.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.entry(id, user!.id) });
      toast({
        title: "Success",
        description: "Journal entry updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update journal entry",
        variant: "destructive",
      });
      console.error('Update entry error:', error);
    },
  });
};

export const useDeleteJournalEntry = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => JournalAPI.deleteEntry(id, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.entries(user!.id) });
      toast({
        title: "Success",
        description: "Journal entry deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete journal entry",
        variant: "destructive",
      });
      console.error('Delete entry error:', error);
    },
  });
};

export const useSearchJournalEntries = (query: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: QUERY_KEYS.searchEntries(user?.id || '', query),
    queryFn: () => JournalAPI.searchEntries(user!.id, query),
    enabled: !!user?.id && query.length > 0,
  });
};

export const useJournalEntriesByMood = (mood: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: QUERY_KEYS.entriesByMood(user?.id || '', mood),
    queryFn: () => JournalAPI.getEntriesByMood(user!.id, mood),
    enabled: !!user?.id && !!mood,
  });
};

export const useJournalEntriesByTag = (tag: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: QUERY_KEYS.entriesByTag(user?.id || '', tag),
    queryFn: () => JournalAPI.getEntriesByTag(user!.id, tag),
    enabled: !!user?.id && !!tag,
  });
};