import { LayoutTemplate } from "lucide-react";
import { SectionTitle } from "@/components/gfl/section-title";

const ENTRY_URL = "https://band.us/@gflentry";

export function OverviewView() {
  return (
    <main className="grid-bg py-20">
      <div className="max-w-4xl mx-auto px-5">
        <SectionTitle sub="A cooperative alliance for faster, smarter clan progression.">
          Overview
        </SectionTitle>
        <article className="gfl-card p-7 md:p-12 space-y-6 text-lg leading-8 text-zinc-700">
          <p>
            The Global Farming League is a premium cooperative alliance built
            for Clash of Clans leaders who want to level up their clans
            faster, smarter, and without the burnout of competitive warring.
          </p>
          <p>
            Currently home to over 135 active clans, GFL is a massive
            community that works together to completely eliminate the stress
            of regular clan wars. By synchronizing our war search times and
            using standardized free-loot base designs, our clans consistently
            match against each other to guarantee massive resource payouts and
            maximum Clan XP for everyone involved.
          </p>
          <p>
            In GFL, you do not need active heroes, expensive war armies, or
            complex attack strategies. We have replaced the pressure of
            fighting to the death with a highly organized, win-win ecosystem.
          </p>
          <p>
            Whether your clan takes the designated win or the designated loss
            for the round, every single member walks away with millions in
            loot and significant clan progression. Less stress, faster
            upgrades, and a worldwide community to support you.
          </p>
          <p>
            Curious about exactly how we coordinate these matches fairly? Head
            over to our Battle Style section to see a complete breakdown of
            our unique point system, sync timeline, and war mechanics!
          </p>
        </article>
      </div>
    </main>
  );
}

const REQUIREMENTS: [string, string][] = [
  [
    "Clan Size",
    "Your clan must have 50 active members to participate in our 50v50 synced wars.",
  ],
  [
    "Leadership",
    "You must be the verified Leader or an authorized Co-Leader of an active clan in good standing.",
  ],
  [
    "War Commitment",
    'Your clan must have dedicated representatives/co-leaders who are reliably available to hit the "Start War" button at our exact synchronized times.',
  ],
  [
    "Clan Weight",
    "Your clan must maintain a healthy overall war weight to ensure balanced matchmaking within our league system.",
  ],
];

const TRANSITION_STEPS: [string, string][] = [
  [
    "Step 1: Update Clan Settings",
    'Set your clan\'s location to "Western Sahara" and update your clan description to state "Future GFL" so our admins know you are preparing to join.',
  ],
  [
    "Step 2: Build your clan",
    "Gather 50 active players. If you are short on members, you can easily recruit players looking for farm wars on platforms like BAND, Discord, or Reddit.",
  ],
  [
    "Step 3: Base Setup",
    "Ensure that all 50 players have copied and activated an officially approved GFL farming base layout before you submit your application.",
  ],
];

export function HowToJoinView() {
  return (
    <main className="grid-bg py-20">
      <div className="max-w-5xl mx-auto px-5">
        <SectionTitle>How to Join</SectionTitle>
        <div className="gfl-card p-7 md:p-10 text-lg leading-8 text-zinc-700">
          <p>
            Ready to become part of the Global Farming League? Joining our
            community is simple. Whether you are fully prepared to apply or
            just want to see how things work, your journey starts here.
          </p>

          <div className="grid md:grid-cols-2 gap-5 my-9">
            <div className="border border-red-100 rounded-2xl p-6">
              <h3 className="font-bold text-xl text-red-700">
                🚪 GFL Entry BAND
              </h3>
              <p className="mt-3">
                If your clan has 50 members and is ready to join, this is your
                first stop. Join our Entry Lounge to speak directly with our
                onboarding team and submit your official application.
              </p>
              <a
                href={ENTRY_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-block gfl-btn px-5 py-3 rounded-xl font-bold mt-5"
              >
                Join GFL Entry BAND
              </a>
            </div>
            <div className="border border-stone-200 rounded-2xl p-6">
              <h3 className="font-bold text-xl">🌍 GFL Community BAND</h3>
              <p className="mt-3">
                Waiting for approval or just want to hang out? Jump into our
                massive Community Hub to chat with existing GFL leaders and
                get a feel for how our league operates.
              </p>
              <button
                disabled
                className="mt-5 px-5 py-3 rounded-xl font-bold border border-stone-200 text-stone-400 cursor-not-allowed"
              >
                Official link coming soon
              </button>
            </div>
          </div>

          <h3 className="display text-3xl uppercase">Joining Requirements</h3>
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            {REQUIREMENTS.map(([title, body]) => (
              <div className="bg-stone-50 rounded-xl p-5" key={title}>
                <b>{title}</b>
                <p className="text-base mt-1">{body}</p>
              </div>
            ))}
          </div>

          <h3 className="display text-3xl uppercase mt-10">
            Transition Process
          </h3>
          <div className="space-y-5 mt-5">
            {TRANSITION_STEPS.map(([title, body]) => (
              <div key={title}>
                <b className="text-red-700">{title}</b>
                <p>{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-red-50 border border-red-100">
            <b className="text-red-800">Important Guidelines &amp; Security</b>
            <p className="mt-2">
              <b>Security Warning:</b> Official GFL Staff will NEVER ask you
              for a Co-Leader or Leader promotion inside your clan to
              &quot;verify&quot; or &quot;audit&quot; you. Protect your clan
              and never give leadership roles to unverified strangers.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

const BATTLE_MECHANICS: [string, string][] = [
  [
    "1. Coordinated Matchmaking",
    "Instead of searching randomly, all GFL clans initiate their war searches at the exact same second using synchronized timers. Because our clans maintain similar war compositions, the game's matchmaking algorithm pairs us together with incredible consistency.",
  ],
  [
    "2. The Free-Loot Base Setup",
    "During the war, every clan activates an approved GFL farming base layout. These layouts place all major defenses (like Inferno Towers and Eagle Artilleries) in one corner, and the Town Hall and resource storages completely exposed in another. This allows even lower-level troops to easily secure high-percentage 2 or 3-star wins.",
  ],
  [
    "3. Fair Win/Loss Distribution",
    "We don't fight to the death; we cooperate. Before the war starts, our official GFL Point System determines the winner based on recent performance to ensure absolute fairness.",
  ],
  [
    "4. Zero Stress, Maximum Progression",
    "There are no complex attack strategies, mirror-matching stress, or expensive army compositions required. Members use cheap farming armies to secure their stars in minutes, allowing your clan to pull in millions of resources every single week while keeping the gameplay relaxed and fun.",
  ],
];

export function BattleStyleView() {
  return (
    <main className="grid-bg py-20">
      <div className="max-w-4xl mx-auto px-5">
        <SectionTitle>Battle Style</SectionTitle>
        <article className="gfl-card p-7 md:p-12 text-lg leading-8 text-zinc-700">
          <p>
            GFL completely replaces the stress of competitive warring with a
            highly coordinated, mutually beneficial system. Our battle style
            is designed to maximize resources and Clan XP for both sides with
            absolute efficiency.
          </p>
          {BATTLE_MECHANICS.map(([title, body]) => (
            <section className="mt-8" key={title}>
              <h3 className="font-bold text-xl text-red-700">{title}</h3>
              <p>{body}</p>
            </section>
          ))}
          <div className="mt-8 bg-stone-50 p-6 rounded-2xl">
            <h3 className="font-bold">Points Distribution</h3>
            <p>
              Win War: +1 Point
              <br />
              Lose War: -1 Point
              <br />
              Mismatch: 0 Points
            </p>
            <h3 className="font-bold mt-4">Winner Determination</h3>
            <p>
              The clan with the lower point total wins the round. If points
              are equal, the system checks the last war result, then previous
              wars until a winner is determined.
              <br />
              Example: Clan X (-2 points) vs Clan Y (-1 point) → Clan X wins
              (lower points).
            </p>
            <h3 className="font-bold mt-4">War Execution</h3>
            <p>
              <b>The Winning Clan:</b> Scores maximum stars (usually 150+ in a
              50vs50 war) to secure the 100% war bonus.
            </p>
            <p>
              <b>The Losing Clan:</b> Easily scores enough stars (100⭐) to
              unlock the maximum possible losing loot bonus and massive Clan
              XP.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}

const ASSISTANCE_ITEMS: [string, string][] = [
  [
    "Emergency War Fillers",
    "Emergencies happen. If a member suddenly leaves your clan right before the sync time, our dedicated staff and clan reps will quickly provide emergency players to fill your clan. This ensures your clan hits the exact 50 member requirement and can start the war search perfectly on schedule.",
  ],
  [
    "Dispute Resolution",
    "If your opponent fails to activate a farming layout or leaves illegal war bases active, our Dispute Department steps in immediately. We guarantee fair judgment, punishing the rule-breaking clan with a forced war loss and awarding your clan the official win.",
  ],
  [
    "Matchmaking Assistance",
    "If your clan does not match against a GFL clan during a sync, our expert staff will step in to provide full, dedicated support. We will help you analyze and adjust your war weights and roster to ensure your clan matches perfectly within the alliance every time.",
  ],
  [
    "Base Audit System",
    "If you are unsure whether all 50 members in your clan have the correct farming layouts set up, you can request an official base audit. Our specialized Audit Team will visit your clan, thoroughly inspect every war base, and provide a detailed report pointing out exactly which bases have errors so you can fix them before the war.",
  ],
  [
    "Blacklist Support",
    'If your clan accidentally matches against a blacklisted clan, our league stands fully behind you. We provide the necessary support and backup to help you defeat them. As a reward for fighting these rogue clans and defending the community, GFL compensates your clan with guaranteed "War Win" credits in our official league point system.',
  ],
];

export function AssistanceView() {
  return (
    <section className="grid-bg py-20">
      <div className="max-w-5xl mx-auto px-5">
        <SectionTitle>Assistance</SectionTitle>
        <div className="grid md:grid-cols-2 gap-5">
          {ASSISTANCE_ITEMS.map(([title, body]) => (
            <div className="gfl-card p-6" key={title}>
              <h3 className="font-bold text-xl text-red-700">{title}</h3>
              <p className="mt-3 leading-7 text-zinc-700">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BaseLayoutsView() {
  return (
    <main className="grid-bg py-20">
      <div className="max-w-4xl mx-auto px-5">
        <SectionTitle sub="Approved layouts will be provided here.">
          Base Layouts
        </SectionTitle>
        <div className="gfl-card p-10 md:p-14 text-center border-2 border-dashed border-stone-300">
          <LayoutTemplate
            className="h-12 w-12 mx-auto text-red-300"
            aria-hidden="true"
          />
          <p className="mt-4 font-bold text-red-700 text-lg">
            Official GFL farming base layouts coming soon
          </p>
          <p className="mt-2 text-sm text-zinc-600 max-w-md mx-auto">
            Add approved layout images or links here when they are available.
            This page intentionally does not display invented layouts.
          </p>
        </div>
      </div>
    </main>
  );
}
