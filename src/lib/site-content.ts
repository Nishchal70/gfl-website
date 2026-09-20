import { z } from "zod";

/**
 * Editable site content model.
 * Text fields support a tiny rich-text syntax:
 *   **bold**            -> <b>
 *   __accent__          -> red underlined bold
 *   \n                  -> line break
 *   blank line (\n\n)   -> new paragraph
 */

export const contentItemSchema = z.object({
  title: z.string(),
  body: z.string(),
});
export type ContentItem = z.infer<typeof contentItemSchema>;

export const homeSchema = z.object({
  heroEyebrow: z.string(),
  heroLine1: z.string(),
  heroLine2: z.string(),
  heroLine3: z.string(),
  heroDescription: z.string(),
  primaryCta: z.string(),
  secondaryCta: z.string(),
  stats: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .length(3),
  aboutTitle: z.string(),
  aboutBody: z.string(),
  chatTitle: z.string(),
  chatDescription: z.string(),
  chatButtonLabel: z.string(),
});
export type HomeContent = z.infer<typeof homeSchema>;

export const overviewSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  paragraphs: z.array(z.string()).min(1),
});
export type OverviewContent = z.infer<typeof overviewSchema>;

export const howToJoinSchema = z.object({
  title: z.string(),
  intro: z.string(),
  entryCardTitle: z.string(),
  entryCardBody: z.string(),
  entryButtonLabel: z.string(),
  entryButtonUrl: z.string(),
  communityCardTitle: z.string(),
  communityCardBody: z.string(),
  communityButtonLabel: z.string(),
  communityButtonUrl: z.string(),
  requirementsTitle: z.string(),
  requirements: z.array(contentItemSchema).min(1),
  transitionTitle: z.string(),
  steps: z.array(contentItemSchema).min(1),
  securityTitle: z.string(),
  securityBody: z.string(),
});
export type HowToJoinContent = z.infer<typeof howToJoinSchema>;

export const battleStyleSchema = z.object({
  title: z.string(),
  intro: z.string(),
  mechanics: z.array(contentItemSchema).min(1),
  pointsTitle: z.string(),
  pointsBody: z.string(),
  winnerTitle: z.string(),
  winnerBody: z.string(),
  executionTitle: z.string(),
  executionWinner: z.string(),
  executionLoser: z.string(),
});
export type BattleStyleContent = z.infer<typeof battleStyleSchema>;

export const assistanceSchema = z.object({
  title: z.string(),
  items: z.array(contentItemSchema).min(1),
});
export type AssistanceContent = z.infer<typeof assistanceSchema>;

export const baseLayoutsSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  placeholderTitle: z.string(),
  placeholderBody: z.string(),
  /** Optional GIF/image shown on the page. Empty string hides the media. */
  mediaSrc: z.string(),
});
export type BaseLayoutsContent = z.infer<typeof baseLayoutsSchema>;

export const pageSchemas = {
  home: homeSchema,
  overview: overviewSchema,
  "how-to-join": howToJoinSchema,
  "battle-style": battleStyleSchema,
  assistance: assistanceSchema,
  "base-layouts": baseLayoutsSchema,
} as const;

export type PageKey = keyof typeof pageSchemas;
export const PAGE_KEYS = Object.keys(pageSchemas) as PageKey[];

export function isPageKey(key: string): key is PageKey {
  return (PAGE_KEYS as string[]).includes(key);
}

export type SiteContent = {
  home: HomeContent;
  overview: OverviewContent;
  "how-to-join": HowToJoinContent;
  "battle-style": BattleStyleContent;
  assistance: AssistanceContent;
  "base-layouts": BaseLayoutsContent;
};

/** The shipped content — identical to the original site copy. */
export const DEFAULT_CONTENT: SiteContent = {
  home: {
    heroEyebrow: "COOPERATIVE CLAN WAR COMMUNITY",
    heroLine1: "GLOBAL",
    heroLine2: "FARMING",
    heroLine3: "LEAGUE",
    heroDescription:
      "Unlock the ultimate Clash of Clans progression strategy. Join 135+ active clans participating in synchronized farming wars and enjoy stress-free growth with guaranteed massive loot payouts every 48 hours.",
    primaryCta: "Join GFL Today",
    secondaryCta: "Learn More",
    stats: [
      { value: "135+", label: "ACTIVE CLANS" },
      { value: "2019", label: "FOUNDED" },
      { value: "1200+", label: "WARS COMPLETED" },
    ],
    aboutTitle: "About Us",
    aboutBody:
      "Founded in 2019, the **Global Farming League (GFL)** is a cooperative community of **135+ clans** dedicated to stress-free progression. We coordinate synchronized matchmaking using the **Western Sahara location** so our clans consistently match against each other. Inside our wars, members use standardized, easy-to-clear [base layouts](#base-layouts) to ensure both sides achieve maximum star counts. This system guarantees that players earn massive war loot while clans rapidly level up their XP with minimal effort. Beyond matchmaking, our dedicated staff team on BAND provides expert war support, mismatch analysis, and blacklist protection. GFL is the ultimate home for clans looking to maximize their rewards without the pressure of competitive gaming.",
    chatTitle: "Join the Global Chat of GFL",
    chatDescription:
      "Scan the official QR code or use the button below to join the GFL Global Chat.",
    chatButtonLabel: "Join GFL Global Chat",
  },
  overview: {
    title: "Overview",
    subtitle: "A cooperative alliance for faster, smarter clan progression.",
    paragraphs: [
      "The Global Farming League is a premium cooperative alliance built for Clash of Clans leaders who want to level up their clans faster, smarter, and without the burnout of competitive warring.",
      "Currently home to over 135 active clans, GFL is a massive community that works together to completely eliminate the stress of regular clan wars. By synchronizing our war search times and using standardized free-loot base designs, our clans consistently match against each other to guarantee massive resource payouts and maximum Clan XP for everyone involved.",
      "In GFL, you do not need active heroes, expensive war armies, or complex attack strategies. We have replaced the pressure of fighting to the death with a highly organized, win-win ecosystem.",
      "Whether your clan takes the designated win or the designated loss for the round, every single member walks away with millions in loot and significant clan progression. Less stress, faster upgrades, and a worldwide community to support you.",
      "Curious about exactly how we coordinate these matches fairly? Head over to our Battle Style section to see a complete breakdown of our unique point system, sync timeline, and war mechanics!",
    ],
  },
  "how-to-join": {
    title: "How to Join",
    intro:
      "Ready to become part of the Global Farming League? Joining our community is simple. Whether you are fully prepared to apply or just want to see how things work, your journey starts here.",
    entryCardTitle: "🚪 GFL Entry BAND",
    entryCardBody:
      "If your clan has 50 members and is ready to join, this is your first stop. Join our Entry Lounge to speak directly with our onboarding team and submit your official application.",
    entryButtonLabel: "Join GFL Entry BAND",
    entryButtonUrl: "https://band.us/@gflentry",
    communityCardTitle: "🌍 GFL Community BAND",
    communityCardBody:
      "Waiting for approval or just want to hang out? Jump into our massive Community Hub to chat with existing GFL leaders and get a feel for how our league operates.",
    communityButtonLabel: "Join GFL Community BAND",
    communityButtonUrl: "https://band.us/@olclan",
    requirementsTitle: "Joining Requirements",
    requirements: [
      {
        title: "Clan Size",
        body: "Your clan must have 50 active members to participate in our 50v50 synced wars.",
      },
      {
        title: "Leadership",
        body: "You must be the verified Leader or an authorized Co-Leader of an active clan in good standing.",
      },
      {
        title: "War Commitment",
        body: 'Your clan must have dedicated representatives/co-leaders who are reliably available to hit the "Start War" button at our exact synchronized times.',
      },
      {
        title: "Clan Weight",
        body: "Your clan must maintain a healthy overall war weight to ensure balanced matchmaking within our league system.",
      },
    ],
    transitionTitle: "Transition Process",
    steps: [
      {
        title: "Step 1: Update Clan Settings",
        body: 'Set your clan\'s location to "Western Sahara" and update your clan description to state "Future GFL" so our admins know you are preparing to join.',
      },
      {
        title: "Step 2: Build your clan",
        body: "Gather 50 active players. If you are short on members, you can easily recruit players looking for farm wars on platforms like BAND, Discord, or Reddit.",
      },
      {
        title: "Step 3: Base Setup",
        body: "Ensure that all 50 players have copied and activated an officially approved GFL farming base layout before you submit your application.",
      },
    ],
    securityTitle: "Important Guidelines & Security",
    securityBody:
      "**Security Warning:** Official GFL Staff will NEVER ask you for a Co-Leader or Leader promotion inside your clan to \"verify\" or \"audit\" you. Protect your clan and never give leadership roles to unverified strangers.",
  },
  "battle-style": {
    title: "Battle Style",
    intro:
      "GFL completely replaces the stress of competitive warring with a highly coordinated, mutually beneficial system. Our battle style is designed to maximize resources and Clan XP for both sides with absolute efficiency.",
    mechanics: [
      {
        title: "1. Coordinated Matchmaking",
        body: "Instead of searching randomly, all GFL clans initiate their war searches at the exact same second using synchronized timers. Because our clans maintain similar war compositions, the game's matchmaking algorithm pairs us together with incredible consistency.",
      },
      {
        title: "2. The Free-Loot Base Setup",
        body: "During the war, every clan activates an approved GFL farming base layout. These layouts place all major defenses (like Inferno Towers and Eagle Artilleries) in one corner, and the Town Hall and resource storages completely exposed in another. This allows even lower-level troops to easily secure high-percentage 2 or 3-star wins.",
      },
      {
        title: "3. Fair Win/Loss Distribution",
        body: "We don't fight to the death; we cooperate. Before the war starts, our official GFL Point System determines the winner based on recent performance to ensure absolute fairness.",
      },
      {
        title: "4. Zero Stress, Maximum Progression",
        body: "There are no complex attack strategies, mirror-matching stress, or expensive army compositions required. Members use cheap farming armies to secure their stars in minutes, allowing your clan to pull in millions of resources every single week while keeping the gameplay relaxed and fun.",
      },
    ],
    pointsTitle: "Points Distribution",
    pointsBody:
      "Win War: +1 Point\nLose War: -1 Point\nMismatch: 0 Points",
    winnerTitle: "Winner Determination",
    winnerBody:
      "The clan with the lower point total wins the round. If points are equal, the system checks the last war result, then previous wars until a winner is determined.\nExample: Clan X (-2 points) vs Clan Y (-1 point) → Clan X wins (lower points).",
    executionTitle: "War Execution",
    executionWinner:
      "**The Winning Clan:** Scores maximum stars (usually 150+ in a 50vs50 war) to secure the 100% war bonus.",
    executionLoser:
      "**The Losing Clan:** Easily scores enough stars (100⭐) to unlock the maximum possible losing loot bonus and massive Clan XP.",
  },
  assistance: {
    title: "Assistance",
    items: [
      {
        title: "Emergency War Fillers",
        body: "Emergencies happen. If a member suddenly leaves your clan right before the sync time, our dedicated staff and clan reps will quickly provide emergency players to fill your clan. This ensures your clan hits the exact 50 member requirement and can start the war search perfectly on schedule.",
      },
      {
        title: "Dispute Resolution",
        body: "If your opponent fails to activate a farming layout or leaves illegal war bases active, our Dispute Department steps in immediately. We guarantee fair judgment, punishing the rule-breaking clan with a forced war loss and awarding your clan the official win.",
      },
      {
        title: "Matchmaking Assistance",
        body: "If your clan does not match against a GFL clan during a sync, our expert staff will step in to provide full, dedicated support. We will help you analyze and adjust your war weights and roster to ensure your clan matches perfectly within the alliance every time.",
      },
      {
        title: "Base Audit System",
        body: "If you are unsure whether all 50 members in your clan have the correct farming layouts set up, you can request an official base audit. Our specialized Audit Team will visit your clan, thoroughly inspect every war base, and provide a detailed report pointing out exactly which bases have errors so you can fix them before the war.",
      },
      {
        title: "Blacklist Support",
        body: 'If your clan accidentally matches against a blacklisted clan, our league stands fully behind you. We provide the necessary support and backup to help you defeat them. As a reward for fighting these rogue clans and defending the community, GFL compensates your clan with guaranteed "War Win" credits in our official league point system.',
      },
    ],
  },
  "base-layouts": {
    title: "Base Layouts",
    subtitle: "Approved layouts will be provided here.",
    placeholderTitle: "Official GFL farming base layouts coming soon",
    placeholderBody:
      "Our approved farming base layouts are being prepared and will be published here as soon as they are ready. Stay tuned!",
    mediaSrc: "/assets/base-layouts-preview.gif",
  },
};

/** Merge stored overrides over the shipped defaults, per page. */
export function mergeContent(
  stored?: Record<string, unknown> | null
): SiteContent {
  const out = {} as SiteContent;
  for (const key of PAGE_KEYS) {
    const override =
      stored && typeof stored[key] === "object" && stored[key] !== null
        ? (stored[key] as object)
        : {};
    out[key] = {
      ...(DEFAULT_CONTENT[key] as object),
      ...override,
    } as SiteContent[typeof key];
  }
  return out;
}
