export interface GroupTemplate {
  id: string;
  name: string;
  description: string;
  category: 'family' | 'friends' | 'community' | 'emergency' | 'business';
  icon: string;
  contributionAmount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  minMembers: number;
  maxMembers: number;
  cycleDuration: number;
  cycleLength: number;
  isPublic: boolean;
  isPopular: boolean;
  usageCount: number;
  tags: string[];
}

export const defaultTemplates: GroupTemplate[] = [
  {
    id: 'family-savings',
    name: 'Family Savings',
    description: 'Perfect for family members saving together for shared goals like vacations, home improvements, or education.',
    category: 'family',
    icon: '👨‍👩‍👧‍👦',
    contributionAmount: 100,
    frequency: 'monthly',
    minMembers: 4,
    maxMembers: 6,
    cycleDuration: 6,
    cycleLength: 30,
    isPublic: true,
    isPopular: true,
    usageCount: 1250,
    tags: ['family', 'savings', 'monthly'],
  },
  {
    id: 'friends-circle',
    name: 'Friends Circle',
    description: 'Ideal for close friends pooling money weekly for social activities, trips, or mutual support.',
    category: 'friends',
    icon: '👥',
    contributionAmount: 50,
    frequency: 'weekly',
    minMembers: 5,
    maxMembers: 10,
    cycleDuration: 10,
    cycleLength: 7,
    isPublic: true,
    isPopular: true,
    usageCount: 980,
    tags: ['friends', 'weekly', 'social'],
  },
  {
    id: 'community-fund',
    name: 'Community Fund',
    description: 'Large group savings for community projects, events, or shared infrastructure improvements.',
    category: 'community',
    icon: '🏘️',
    contributionAmount: 75,
    frequency: 'monthly',
    minMembers: 10,
    maxMembers: 20,
    cycleDuration: 12,
    cycleLength: 30,
    isPublic: true,
    isPopular: true,
    usageCount: 750,
    tags: ['community', 'large-group', 'monthly'],
  },
  {
    id: 'emergency-fund',
    name: 'Emergency Fund',
    description: 'Flexible savings group for unexpected expenses with quick access to funds when needed.',
    category: 'emergency',
    icon: '🚨',
    contributionAmount: 150,
    frequency: 'monthly',
    minMembers: 3,
    maxMembers: 5,
    cycleDuration: 4,
    cycleLength: 30,
    isPublic: true,
    isPopular: false,
    usageCount: 420,
    tags: ['emergency', 'flexible', 'small-group'],
  },
  {
    id: 'business-partnership',
    name: 'Business Partnership',
    description: 'Quarterly contributions for business partners investing in shared ventures or equipment.',
    category: 'business',
    icon: '💼',
    contributionAmount: 500,
    frequency: 'quarterly',
    minMembers: 2,
    maxMembers: 4,
    cycleDuration: 4,
    cycleLength: 90,
    isPublic: true,
    isPopular: true,
    usageCount: 650,
    tags: ['business', 'quarterly', 'investment'],
  },
];

export const categoryInfo = {
  family: {
    name: 'Family',
    description: 'Savings groups for family members',
    color: 'blue',
  },
  friends: {
    name: 'Friends',
    description: 'Groups for close friends',
    color: 'purple',
  },
  community: {
    name: 'Community',
    description: 'Large community savings',
    color: 'green',
  },
  emergency: {
    name: 'Emergency',
    description: 'Quick access emergency funds',
    color: 'red',
  },
  business: {
    name: 'Business',
    description: 'Professional partnerships',
    color: 'orange',
  },
};
