export interface Author {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  role: string;
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: Author;
  authorId: string;
  readTime: number;
  createdAt: string;
  comments: Comment[];
}

export const CATEGORIES = [
  "Design",
  "Technology",
  "Culture",
  "Philosophy",
  "Workflow",
  "Future",
] as const;

const cover = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=1600&q=80`;
const avatar = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=200&h=200&q=80`;

export const AUTHORS: Author[] = [
  {
    id: "u_julian",
    name: "Julian Thorne",
    username: "julian",
    avatar: avatar("photo-1535713875002-d1d0cf377fde"),
    bio: "Design Lead at Aether. Writing about typography, restraint, and the architecture of attention.",
    role: "Design Lead",
  },
  {
    id: "u_elena",
    name: "Elena Vance",
    username: "elena",
    avatar: avatar("photo-1438761681033-6461ffad8d80"),
    bio: "Behavioral researcher exploring how interfaces quietly shape what we think and do.",
    role: "UX Researcher",
  },
  {
    id: "u_marcus",
    name: "Marcus Aurel",
    username: "marcus",
    avatar: avatar("photo-1500648767791-00dcc994a43e"),
    bio: "Independent writer. Deep work, monastic focus, and the discipline of finishing.",
    role: "Essayist",
  },
  {
    id: "u_sarah",
    name: "Sarah Chen",
    username: "sarah",
    avatar: avatar("photo-1494790108377-be9c29b29330"),
    bio: "AI ethicist. Asking the uncomfortable questions about generative systems.",
    role: "AI Ethicist",
  },
];

export const BLOGS: Blog[] = [
  {
    id: "b1",
    slug: "the-silent-architecture-of-modern-thought",
    title: "The Silent Architecture of Modern Thought",
    excerpt:
      "Exploring the intersection of digital minimalist principles and the cognitive load of the modern information era.",
    content: `We are not, by nature, minimalists. The human mind is a relentless collector — of ideas, of artifacts, of unfinished tabs.

And yet the most enduring digital products of the last decade have been those that refused the maximalist impulse. They withheld. They edited. They left space.

The discipline of subtraction is not about taste. It is about cognition. Every element on a page extracts a small tax from the reader's attention. The most generous interfaces are the ones that pay that tax back as silence.

> Good design is as little design as possible. It is a return to purity, a return to simplicity.

When we design for thought, we are designing for the spaces between the words. The pause before the next paragraph. The breath the reader takes before deciding whether to continue.

That breath is the entire product.`,
    coverImage: cover("photo-1503264116251-35a269479413"),
    category: "Design",
    tags: ["minimalism", "typography", "ux"],
    author: AUTHORS[0],
    authorId: AUTHORS[0].id,
    readTime: 12,
    createdAt: "2024-10-24T09:00:00Z",
    comments: [
      {
        id: "c1",
        author: AUTHORS[1],
        content: "The 'tax on attention' framing is exactly right. Saving this.",
        createdAt: "2024-10-24T11:20:00Z",
      },
    ],
  },
  {
    id: "b2",
    slug: "the-subconscious-influence-of-dark-patterns",
    title: "The Subconscious Influence of Dark Patterns",
    excerpt:
      "How UX design decisions shape human behavior far beyond our immediate awareness.",
    content: `A dark pattern is rarely loud. It hides in defaults, in pre-checked boxes, in the geography of a confirm button placed one pixel too close to its destructive twin.

The most effective manipulations are the ones we feel as preferences. We did not choose; we were architected.`,
    coverImage: cover("photo-1518770660439-4636190af475"),
    category: "Culture",
    tags: ["ethics", "psychology", "ux"],
    author: AUTHORS[1],
    authorId: AUTHORS[1].id,
    readTime: 8,
    createdAt: "2024-10-22T08:00:00Z",
    comments: [],
  },
  {
    id: "b3",
    slug: "monastic-focus-in-a-distracted-world",
    title: "Monastic Focus in a Distracted World",
    excerpt:
      "Strategies for maintaining deep work sessions in an era of constant connectivity.",
    content: `The monk does not resist distraction by willpower. The monk arranges a life in which distraction has nowhere to land.

Your environment is your operating system. Edit the environment and the behavior follows.`,
    coverImage: cover("photo-1499750310107-5fef28a66643"),
    category: "Workflow",
    tags: ["focus", "deep-work", "habits"],
    author: AUTHORS[2],
    authorId: AUTHORS[2].id,
    readTime: 6,
    createdAt: "2024-10-19T08:00:00Z",
    comments: [],
  },
  {
    id: "b4",
    slug: "generative-ethics-a-new-frontier",
    title: "Generative Ethics: A New Frontier",
    excerpt:
      "Who owns the output of a machine that learned from the collective human history?",
    content: `Attribution is the unsolved problem of the generative era. Every output is a statistical echo of millions of inputs whose authors will never be named.

We need a new vocabulary for credit, consent, and contribution.`,
    coverImage: cover("photo-1677442136019-21780ecad995"),
    category: "Future",
    tags: ["ai", "ethics", "ownership"],
    author: AUTHORS[3],
    authorId: AUTHORS[3].id,
    readTime: 10,
    createdAt: "2024-10-15T08:00:00Z",
    comments: [],
  },
  {
    id: "b5",
    slug: "the-texture-of-digital-ink",
    title: "The Texture of Digital Ink",
    excerpt:
      "Reimagining the sensory experience of reading on OLED displays.",
    content: `Ink has weight. Paper has tooth. Pixels, until recently, had neither.

The next generation of reading surfaces is closing the gap — and changing how we feel about long-form writing in the process.`,
    coverImage: cover("photo-1455390582262-044cdead277a"),
    category: "Technology",
    tags: ["reading", "hardware", "typography"],
    author: AUTHORS[0],
    authorId: AUTHORS[0].id,
    readTime: 7,
    createdAt: "2024-10-10T08:00:00Z",
    comments: [],
  },
  {
    id: "b6",
    slug: "rituals-of-the-morning",
    title: "Rituals of the Morning",
    excerpt:
      "How environment shapes the quality of deep creative work.",
    content: `The morning ritual is not magic. It is a contract you sign with the next eight hours.

The ritual tells your mind: the work begins now. Everything before it was rehearsal.`,
    coverImage: cover("photo-1506905925346-21bda4d32df4"),
    category: "Philosophy",
    tags: ["habits", "creativity"],
    author: AUTHORS[2],
    authorId: AUTHORS[2].id,
    readTime: 5,
    createdAt: "2024-10-05T08:00:00Z",
    comments: [],
  },
];
