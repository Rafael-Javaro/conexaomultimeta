// Copiar seed.json para o projeto para que possa ser importado
import seedData from '../seed.json';

export interface Profile {
  id: string;
  role: 'expert' | 'closer';
  company_name?: string;
  bio?: string;
  created_at: string;
  moderation_status: string;
}

export interface Opportunity {
  id: string;
  expert_id: string;
  title: string;
  status: 'open' | 'filled' | 'deleted';
  moderation_status: string;
  created_at: string;
  filled_at?: string;
}

export interface Conversation {
  id: string;
  opportunity_id: string;
  expert_id: string;
  closer_id: string;
  status: 'active' | 'hired' | 'archived';
  hired_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string;
}

export interface SeedData {
  profiles: Profile[];
  opportunities: Opportunity[];
  conversations: Conversation[];
  messages: Message[];
}

export function loadSeed(): SeedData {
  return seedData as SeedData;
}

export function getProfileName(profileId: string, seed: SeedData): string {
  const profile = seed.profiles.find(p => p.id === profileId);
  if (!profile) return profileId;
  return profile.role === 'expert' 
    ? (profile.company_name || 'Unknown')
    : `Closer ${profileId}`;
}
