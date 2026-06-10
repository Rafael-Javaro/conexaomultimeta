import { SeedData, Conversation, Message, Profile } from './seed';

export interface DashboardMetrics {
  weekNewOpportunities: number;
  previousWeekOpportunities: number;
  totalOpportunities: number;
  totalActiveConversations: number;
  weekNewConversations: number;
  totalHired: number;
  weekHired: number;
  previousWeekHired: number;
  totalUniqueClosersHired: number;
  avgExpertResponseTimeHours: number;
  staleConversations: StaleConversation[];
  slowExperts: SlowExpert[];
  uncontractedClosers: UncontractedCloser[];
  lowEngagementClosers: LowEngagementCloser[];
  recentConversations: RecentConversationItem[];
  activeConversationsDetailed: ActiveConversationDetail[];
}

export interface ActiveConversationDetail {
  id: string;
  expertName: string;
  closerName: string;
  expertId: string;
  closerId: string;
  status: string;
  avgResponseTimeHours: number;
  messageCount: number;
  createdAt: string;
  lastMessageTime: string;
}

export interface StaleConversation {
  id: string;
  expertName: string;
  closerName: string;
  lastUpdateAt: string;
  hoursStale: number;
}

export interface SlowExpert {
  id: string;
  name: string;
  lastResponseHours: number;
  opportunityTitle: string;
}

export interface UncontractedCloser {
  id: string;
  name: string;
  interestCount: number;
}

export interface LowEngagementCloser {
  id: string;
  name: string;
  interestCount: number;
}

export interface RecentConversationItem {
  id: string;
  expertName: string;
  closerName: string;
  status: string;
  lastMessagePreview: string;
  lastMessageTime: string;
  hoursAgo: number;
  hasUnreadMessages: boolean;
}

const DEFAULT_END_DATE = new Date('2026-06-05T23:59:59Z');
const STALE_THRESHOLD_HOURS = 72;
const SLOW_EXPERT_THRESHOLD_HOURS = 48;

function getDateDaysAgo(days: number, baseDate: Date = DEFAULT_END_DATE): Date {
  return new Date(baseDate.getTime() - days * 24 * 60 * 60 * 1000);
}

function hoursBetween(from: string, to: string): number {
  const d1 = new Date(from);
  const d2 = new Date(to);
  return Math.max(0, (d2.getTime() - d1.getTime()) / (1000 * 60 * 60));
}

function getProfileName(profileId: string, seed: SeedData): string {
  const profile = seed.profiles.find(p => p.id === profileId);
  if (!profile) return profileId.slice(0, 8);
  return profile.role === 'expert' 
    ? (profile.company_name?.split(' ').slice(0, 2).join(' ') || 'Expert')
    : `Closer ${profileId.slice(-2)}`;
}

function getOpportunityTitle(oppId: string, seed: SeedData): string {
  const opp = seed.opportunities.find(o => o.id === oppId);
  return opp?.title || oppId;
}

export function computeMetrics(seed: SeedData, endDate: Date = DEFAULT_END_DATE): DashboardMetrics {
  const NOW = endDate;
  const WEEK_AGO = getDateDaysAgo(7, endDate);
  const twoWeeksAgo = getDateDaysAgo(14, endDate);

  // Q1: Vagas novas essa semana
  const weekNewOpportunities = seed.opportunities.filter(opp => {
    const createdAt = new Date(opp.created_at);
    return createdAt >= WEEK_AGO && opp.status !== 'deleted';
  }).length;

  // Q1b: Vagas novas na semana anterior
  const previousWeekOpportunities = seed.opportunities.filter(opp => {
    const createdAt = new Date(opp.created_at);
    return createdAt >= twoWeeksAgo && createdAt < WEEK_AGO && opp.status !== 'deleted';
  }).length;

  // Q1c: Total de vagas no marketplace
  const totalOpportunities = seed.opportunities.filter(opp => opp.status !== 'deleted').length;

  // Q2a: Conversas totais ativas
  const totalActiveConversations = seed.conversations.filter(
    c => c.status === 'active'
  ).length;

  // Q2b: Conversas novas essa semana
  const weekNewConversations = seed.conversations.filter(c => {
    const createdAt = new Date(c.created_at);
    return createdAt >= WEEK_AGO;
  }).length;

  // Q2c: Total contratações (histórico)
  const totalHired = seed.conversations.filter(c => c.hired_at).length;

  // Q2d: Contratações essa semana
  const weekHired = seed.conversations.filter(c => {
    if (!c.hired_at) return false;
    const hiredAt = new Date(c.hired_at);
    return hiredAt >= WEEK_AGO;
  }).length;

  // Q2e: Contratações na semana anterior
  const previousWeekHired = seed.conversations.filter(c => {
    if (!c.hired_at) return false;
    const hiredAt = new Date(c.hired_at);
    return hiredAt >= twoWeeksAgo && hiredAt < WEEK_AGO;
  }).length;

  // Q2f: Total de closers únicos já contratados
  const uniqueClosersHired = new Set<string>();
  seed.conversations.forEach(c => {
    if (c.hired_at) {
      uniqueClosersHired.add(c.closer_id);
    }
  });
  const totalUniqueClosersHired = uniqueClosersHired.size;

  // Q3: Tempo médio de resposta dos experts
  const expertResponseTimes: number[] = [];
  for (const conv of seed.conversations) {
    const convMessages = seed.messages.filter(m => m.conversation_id === conv.id);
    for (let i = 0; i < convMessages.length - 1; i++) {
      const current = convMessages[i];
      const next = convMessages[i + 1];
      // Se closer mandou e expert respondeu
      if (current.sender_id === conv.closer_id && next.sender_id === conv.expert_id) {
        const hours = hoursBetween(current.created_at, next.created_at);
        expertResponseTimes.push(hours);
      }
    }
  }
  const avgExpertResponseTimeHours = expertResponseTimes.length > 0
    ? Math.round(expertResponseTimes.reduce((a, b) => a + b, 0) / expertResponseTimes.length * 10) / 10
    : 0;

  // Q4 & Alert: Conversas paradas > 72h
  const staleConversations: StaleConversation[] = [];
  for (const conv of seed.conversations) {
    if (conv.status !== 'active') continue;
    const updatedAt = new Date(conv.updated_at);
    const hoursStale = hoursBetween(conv.updated_at, NOW.toISOString());
    if (hoursStale > STALE_THRESHOLD_HOURS) {
      staleConversations.push({
        id: conv.id,
        expertName: getProfileName(conv.expert_id, seed),
        closerName: getProfileName(conv.closer_id, seed),
        lastUpdateAt: conv.updated_at,
        hoursStale: Math.round(hoursStale),
      });
    }
  }
  staleConversations.sort((a, b) => b.hoursStale - a.hoursStale);

  // Q4 & Alert: Experts lentos (não responderam em 48h+)
  const slowExperts: SlowExpert[] = [];
  const expertLastResponseMap = new Map<string, number>();

  for (const conv of seed.conversations) {
    if (conv.status === 'archived') continue;
    const convMessages = seed.messages.filter(m => m.conversation_id === conv.id);
    
    // Encontra a última mensagem do expert
    const lastExpertMessage = [...convMessages]
      .reverse()
      .find(m => m.sender_id === conv.expert_id);
    
    if (lastExpertMessage) {
      const hours = hoursBetween(lastExpertMessage.created_at, NOW.toISOString());
      // Se tem mensagens do closer DEPOIS da resposta do expert
      const hasNewerCloserMessage = convMessages.some(
        m => m.sender_id === conv.closer_id && 
             new Date(m.created_at) > new Date(lastExpertMessage.created_at)
      );
      
      if (hasNewerCloserMessage && hours > SLOW_EXPERT_THRESHOLD_HOURS) {
        expertLastResponseMap.set(conv.expert_id, Math.max(
          expertLastResponseMap.get(conv.expert_id) || 0,
          hours
        ));
      }
    }
  }

  for (const [expertId, hours] of expertLastResponseMap) {
    // Pega a vaga principal do expert (última ativa)
    const convs = seed.conversations.filter(c => c.expert_id === expertId && c.status === 'active');
    if (convs.length > 0) {
      const lastConv = convs[convs.length - 1];
      slowExperts.push({
        id: expertId,
        name: getProfileName(expertId, seed),
        lastResponseHours: Math.round(hours),
        opportunityTitle: getOpportunityTitle(lastConv.opportunity_id, seed),
      });
    }
  }
  slowExperts.sort((a, b) => b.lastResponseHours - a.lastResponseHours);

  // Q5 & Alert: Closers engajados mas sem contrato
  const interestsByCloser = new Map<string, number>();
  for (const interest of (seed as any).opportunity_interests || []) {
    const count = interestsByCloser.get(interest.closer_id) || 0;
    interestsByCloser.set(interest.closer_id, count + 1);
  }

  const uncontractedClosers: UncontractedCloser[] = [];
  for (const [closerId, interestCount] of interestsByCloser) {
    if (interestCount < 3) continue; // Mínimo 3 interests para constar no alerta
    
    const hired = seed.conversations.filter(
      c => c.closer_id === closerId && c.hired_at
    ).length;
    
    if (hired === 0) {
      uncontractedClosers.push({
        id: closerId,
        name: getProfileName(closerId, seed),
        interestCount,
      });
    }
  }
  uncontractedClosers.sort((a, b) => b.interestCount - a.interestCount);

  // Closers com baixo engajamento (0-1 interesses)
  const lowEngagementClosers: LowEngagementCloser[] = [];
  for (const [closerId, interestCount] of interestsByCloser) {
    if (interestCount <= 1) {
      lowEngagementClosers.push({
        id: closerId,
        name: getProfileName(closerId, seed),
        interestCount,
      });
    }
  }
  lowEngagementClosers.sort((a, b) => a.interestCount - b.interestCount); // Ordenar: 0 primeiro

  // Conversas ativas detalhadas (para o modal)
  const activeConversationsDetailed: ActiveConversationDetail[] = [];
  const activeConvs = seed.conversations.filter(c => c.status === 'active');

  for (const conv of activeConvs) {
    const convMessages = seed.messages.filter(m => m.conversation_id === conv.id);
    const lastMessage = convMessages[convMessages.length - 1];
    
    // Calcula tempo médio de resposta para esta conversa específica
    const responseTimesForConv: number[] = [];
    for (let i = 0; i < convMessages.length - 1; i++) {
      const current = convMessages[i];
      const next = convMessages[i + 1];
      // Se uma das partes respondeu à outra
      if (current.sender_id !== next.sender_id) {
        const hours = hoursBetween(current.created_at, next.created_at);
        responseTimesForConv.push(hours);
      }
    }
    const avgResponseForConv = responseTimesForConv.length > 0
      ? Math.round(responseTimesForConv.reduce((a, b) => a + b, 0) / responseTimesForConv.length * 10) / 10
      : 0;

    activeConversationsDetailed.push({
      id: conv.id,
      expertName: getProfileName(conv.expert_id, seed),
      closerName: getProfileName(conv.closer_id, seed),
      expertId: conv.expert_id,
      closerId: conv.closer_id,
      status: 'Ativo',
      avgResponseTimeHours: avgResponseForConv,
      messageCount: convMessages.length,
      createdAt: new Date(conv.created_at).toLocaleDateString('pt-BR'),
      lastMessageTime: new Date(lastMessage?.created_at || conv.updated_at).toLocaleString('pt-BR'),
    });
  }
  activeConversationsDetailed.sort(
    (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  );

  // Conversas recentes
  const recentConversations: RecentConversationItem[] = [];
  const recentConvs = [...seed.conversations]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 10);

  for (const conv of recentConvs) {
    const convMessages = seed.messages.filter(m => m.conversation_id === conv.id);
    const lastMessage = convMessages[convMessages.length - 1];
    const unreadCount = convMessages.filter(m => !m.read_at).length;
    const hasUnread = unreadCount > 0;
    
    const lastMsgPreview = lastMessage?.content?.substring(0, 50) || '(no messages)';
    const hoursAgo = Math.round(hoursBetween(conv.updated_at, NOW.toISOString()));
    
    recentConversations.push({
      id: conv.id,
      expertName: getProfileName(conv.expert_id, seed),
      closerName: getProfileName(conv.closer_id, seed),
      status: conv.status === 'hired' ? '✓ Contratado' : 
              conv.status === 'archived' ? 'Arquivado' : 'Ativo',
      lastMessagePreview: lastMsgPreview,
      lastMessageTime: new Date(lastMessage?.created_at || conv.updated_at).toLocaleString('pt-BR'),
      hoursAgo,
      hasUnreadMessages: hasUnread,
    });
  }

  return {
    weekNewOpportunities,
    previousWeekOpportunities,
    totalOpportunities,
    totalActiveConversations,
    weekNewConversations,
    totalHired,
    weekHired,
    previousWeekHired,
    totalUniqueClosersHired,
    avgExpertResponseTimeHours,
    staleConversations,
    slowExperts,
    uncontractedClosers,
    lowEngagementClosers,
    recentConversations,
    activeConversationsDetailed,
  };
}
