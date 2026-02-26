export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

export const faqs: FAQ[] = [
  {
    id: 'what-is-ajo',
    category: 'Getting Started',
    question: 'What is Ajo?',
    answer:
      'Ajo is a decentralized savings group platform built on the Stellar blockchain. It enables communities to create and manage traditional rotating savings and credit associations (ROSCAs) with full transparency and security.',
    tags: ['basics', 'introduction', 'ajo'],
  },
  {
    id: 'how-does-it-work',
    category: 'Getting Started',
    question: 'How does Ajo work?',
    answer:
      'Members of a group contribute a fixed amount each cycle. One member receives the full pool each round until everyone has been paid out. All transactions are recorded on the blockchain for transparency.',
    tags: ['basics', 'how-to', 'process'],
  },
  {
    id: 'connect-wallet',
    category: 'Wallet',
    question: 'How do I connect my wallet?',
    answer:
      'Click the "Connect Wallet" button in the header. You\'ll need the Freighter wallet extension installed. If you don\'t have it, you\'ll be prompted to install it first.',
    tags: ['wallet', 'freighter', 'setup'],
  },
  {
    id: 'create-group',
    category: 'Groups',
    question: 'How do I create a savings group?',
    answer:
      'Navigate to the Dashboard and click "Create Group". Fill in the group details including contribution amount, cycle duration, and maximum members. Confirm the transaction in your wallet.',
    tags: ['groups', 'create', 'setup'],
  },
  {
    id: 'join-group',
    category: 'Groups',
    question: 'How do I join an existing group?',
    answer:
      'Browse available groups on the Dashboard or Groups page. Click on a group to view details, then click "Join Group". Confirm the transaction in your wallet to become a member.',
    tags: ['groups', 'join', 'membership'],
  },
  {
    id: 'make-contribution',
    category: 'Contributions',
    question: 'How do I make a contribution?',
    answer:
      'Go to your group\'s page and click "Make Contribution". Enter the required amount and confirm the transaction in your wallet. You can only contribute once per cycle.',
    tags: ['contributions', 'payment', 'cycle'],
  },
  {
    id: 'payout-order',
    category: 'Payouts',
    question: 'How is the payout order determined?',
    answer:
      'Payouts are distributed in the order members joined the group. The first member to join receives the first payout, and so on. This order is transparent and recorded on the blockchain.',
    tags: ['payouts', 'order', 'distribution'],
  },
  {
    id: 'cycle-duration',
    category: 'Groups',
    question: 'What is a cycle duration?',
    answer:
      'Cycle duration is the time period for each round of contributions. For example, a 30-day cycle means members have 30 days to contribute before the payout is distributed.',
    tags: ['cycle', 'duration', 'timing'],
  },
  {
    id: 'transaction-fees',
    category: 'Fees',
    question: 'Are there any fees?',
    answer:
      'The only fees are standard Stellar network transaction fees (typically less than 0.00001 XLM). There are no platform fees for using Ajo.',
    tags: ['fees', 'costs', 'stellar'],
  },
  {
    id: 'security',
    category: 'Security',
    question: 'Is my money safe?',
    answer:
      'Yes. All funds are managed by smart contracts on the Stellar blockchain. The code is open-source and auditable. You maintain full control of your wallet and funds.',
    tags: ['security', 'safety', 'blockchain'],
  },
  {
    id: 'minimum-members',
    category: 'Groups',
    question: 'What is the minimum number of members?',
    answer:
      'A group requires at least 2 members to function. The maximum is 100 members per group.',
    tags: ['groups', 'members', 'limits'],
  },
  {
    id: 'missed-contribution',
    category: 'Contributions',
    question: 'What happens if I miss a contribution?',
    answer:
      'If you miss a contribution, the payout for that cycle may be delayed until all members have contributed. It\'s important to contribute on time to keep the group running smoothly.',
    tags: ['contributions', 'missed', 'penalties'],
  },
  {
    id: 'leave-group',
    category: 'Groups',
    question: 'Can I leave a group?',
    answer:
      'Once you join a group and it becomes active, you should complete all cycles. Leaving early may affect other members. Contact your group creator for special circumstances.',
    tags: ['groups', 'leave', 'exit'],
  },
  {
    id: 'xlm-currency',
    category: 'Currency',
    question: 'What currency is used?',
    answer:
      'All contributions and payouts are in XLM (Stellar Lumens), the native cryptocurrency of the Stellar network.',
    tags: ['currency', 'xlm', 'stellar'],
  },
  {
    id: 'mobile-support',
    category: 'Technical',
    question: 'Can I use Ajo on mobile?',
    answer:
      'Yes! Ajo is fully responsive and works on mobile browsers. You can also install it as a Progressive Web App (PWA) for a native app experience.',
    tags: ['mobile', 'pwa', 'responsive'],
  },
];

export const faqCategories = Array.from(
  new Set(faqs.map((faq) => faq.category))
);
