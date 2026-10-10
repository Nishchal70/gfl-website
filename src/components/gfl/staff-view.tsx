"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  Compass,
  Eye,
  EyeOff,
  ExternalLink,
  HeartHandshake,
  Home,
  Info,
  KeyRound,
  LayoutTemplate,
  Loader2,
  LogOut,
  MousePointerClick,
  PencilLine,
  Rocket,
  ScrollText,
  ShieldCheck,
  Swords,
  UserPlus,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionTitle } from "@/components/gfl/section-title";
import { Reveal } from "@/components/gfl/reveal";
import { useToast } from "@/hooks/use-toast";
import { HomeEditor, OverviewEditor } from "@/components/gfl/dashboard/editors-home";
import {
  AssistanceEditor,
  BaseLayoutsEditor,
  BattleStyleEditor,
  HowToJoinEditor,
  OpponentsEditor,
} from "@/components/gfl/dashboard/editors-pages";
import { TeamManager } from "@/components/gfl/dashboard/team-manager";
import { AccountSettings } from "@/components/gfl/dashboard/account-settings";
import { isCreator } from "@/lib/staff-roles";

type Staff = {
  email: string;
  name: string;
  role: string;
  clanName: string | null;
};

const ENTRY_URL = "https://band.us/@gflentry";
const GLOBAL_CHAT_URL =
  "https://link.clashofclans.com/?action=OpenGlobalChat&chatId=Pfb0ca7b465354a2896bdf798cd9d72be";

/** One dashboard section: what it is, what it edits, and where it lives on the site. */
type TabMeta = {
  id: string;
  label: string;
  icon: LucideIcon;
  desc: string;
  href?: string;
};

const CONTENT_TABS: TabMeta[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    desc: "Hero text, the three stat numbers, the About Us box and the Global chat section.",
    href: "/",
  },
  {
    id: "overview",
    label: "Overview",
    icon: BookOpen,
    desc: "The Overview page — title, subtitle and story paragraphs.",
    href: "/#overview",
  },
  {
    id: "how-to-join",
    label: "How to Join",
    icon: UserPlus,
    desc: "Join requirements, transition steps and both BAND join cards.",
    href: "/#how-to-join",
  },
  {
    id: "battle-style",
    label: "Battle Style",
    icon: Swords,
    desc: "The Battle Style page — titles, paragraphs and rules.",
    href: "/#battle-style",
  },
  {
    id: "assistance",
    label: "Assistance",
    icon: HeartHandshake,
    desc: "The Assistance page — intro text and the help cards.",
    href: "/#assistance",
  },
  {
    id: "base-layouts",
    label: "Base Layouts",
    icon: LayoutTemplate,
    desc: "The Base Layouts section — preview image and description.",
    href: "/#base-layouts",
  },
  {
    id: "opponents",
    label: "Opponents",
    icon: ScrollText,
    desc: "The \u201cA Letter to Opponents\u201d page — letter text and contact buttons.",
    href: "/#opponents",
  },
];

const ACCOUNT_TAB: TabMeta = {
  id: "account",
  label: "Account",
  icon: KeyRound,
  desc: "Change your own password anytime — every staff member can.",
};

const TEAM_TAB: TabMeta = {
  id: "team",
  label: "Team",
  icon: Users,
  desc: "Register new staff, edit profiles and change roles. (Creator only)",
};

const TRIGGER_CLS =
  "flex-none rounded-lg px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-sm";
const CONTENT_CLS = "mt-6 data-[state=inactive]:hidden";

function LoginCard({ onSuccess }: { onSuccess: (staff: Staff) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        return;
      }
      toast({
        title: "Welcome back!",
        description: `Signed in as ${data.staff.name} (${data.staff.role}).`,
      });
      onSuccess(data.staff);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Reveal className="w-full">
      <div className="gfl-card p-8">
        <div className="flex items-center gap-2 text-zinc-700">
          <KeyRound className="h-5 w-5 text-red-600 shrink-0" aria-hidden="true" />
          <p className="text-sm">
            Staff access only — sign in with the email and password given to
            you by GFL leadership.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="staff-email">Email</Label>
            <Input
              id="staff-email"
              type="email"
              autoComplete="email"
              placeholder="you@gfl.gg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-1.5 mt-4">
            <Label htmlFor="staff-password">Password</Label>
            <div className="relative">
              <Input
                id="staff-password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                {showPw ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="gfl-btn w-full mt-6 py-3 rounded-xl font-bold h-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="text-xs text-zinc-500 text-center mt-5 leading-5">
          First time signing in, or forgot your password? Message the Creator —
          they can set up or reset your account in seconds.
        </p>
      </div>
    </Reveal>
  );
}

/** Info strip shown above every editor: what this section edits + a link to see it live. */
function TabHeader({ icon: Icon, label, desc, href }: TabMeta) {
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-xl border border-stone-200 bg-stone-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <span className="h-9 w-9 shrink-0 rounded-lg bg-red-50 border border-red-100 text-red-700 grid place-items-center">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold">{label}</p>
          <p className="text-xs text-zinc-500 leading-4">{desc}</p>
        </div>
      </div>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 hover:underline underline-offset-2"
        >
          View this page
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

/** Card in the Start Here grid that jumps straight to a section tab. */
function NavCard({ tab, onOpen }: { tab: TabMeta; onOpen: (key: string) => void }) {
  const Icon = tab.icon;
  return (
    <button
      type="button"
      onClick={() => onOpen(tab.id)}
      className="group text-left rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-red-200"
    >
      <div className="flex items-center gap-3">
        <span className="h-9 w-9 shrink-0 rounded-lg bg-red-50 border border-red-100 text-red-700 grid place-items-center">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm">{tab.label}</p>
          <p className="text-xs text-zinc-500 leading-5 mt-0.5">{tab.desc}</p>
        </div>
        <ChevronRight
          className="h-4 w-4 text-stone-300 group-hover:text-red-600 transition-colors shrink-0"
          aria-hidden="true"
        />
      </div>
    </button>
  );
}

/** One row inside the Useful Links box of Start Here. */
function LinkRow({
  icon: Icon,
  label,
  sub,
  href,
  onOpen,
  external,
}: {
  icon: LucideIcon;
  label: string;
  sub: string;
  href?: string;
  onOpen?: () => void;
  external?: boolean;
}) {
  const cls =
    "w-full flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 hover:bg-white hover:border-stone-200 transition-colors text-left";
  const inner = (
    <>
      <span className="h-8 w-8 shrink-0 rounded-lg bg-stone-100 border border-stone-200 text-zinc-600 grid place-items-center">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{label}</span>
        <span className="block text-xs text-zinc-500">{sub}</span>
      </span>
      {external && <ExternalLink className="h-3.5 w-3.5 text-stone-400 shrink-0" aria-hidden="true" />}
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onOpen} className={cls}>
      {inner}
    </button>
  );
}

/** Cheat-sheet row: code chip -> what it renders. */
function CheatRow({ code, result }: { code: string; result: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <code className="bg-stone-100 border border-stone-200 rounded-md px-1.5 py-0.5 text-xs font-mono whitespace-nowrap">
        {code}
      </code>
      <span className="text-zinc-600">{result}</span>
    </div>
  );
}

/** Landing tab after sign-in: orients the user, links everywhere in one click. */
function StartHere({
  name,
  creator,
  onOpen,
}: {
  name: string;
  creator: boolean;
  onOpen: (key: string) => void;
}) {
  const steps = [
    {
      icon: MousePointerClick,
      title: "1. Pick a section",
      body: "Every part of the website has its own tab — the cards below take you straight there.",
    },
    {
      icon: PencilLine,
      title: "2. Edit the fields",
      body: "Type your text into the fields. The cheatsheet shows how to make words bold, red or linked.",
    },
    {
      icon: Rocket,
      title: "3. Save & publish",
      body: "Press the red button at the bottom of the editor — your change goes live instantly.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-red-100 bg-red-50/60 p-5">
        <p className="font-bold text-red-900">Welcome, {name}!</p>
        <p className="text-sm text-red-800/80 mt-1 leading-6">
          Everything on the website can be edited from this dashboard — no
          coding needed. Not sure where something lives? The cards below will
          take you straight to it.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {steps.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-stone-200 bg-stone-50/60 p-4"
          >
            <s.icon className="h-5 w-5 text-red-600" aria-hidden="true" />
            <p className="font-bold text-sm mt-2">{s.title}</p>
            <p className="text-xs text-zinc-500 mt-1 leading-5">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">
          Edit website content
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {CONTENT_TABS.map((t) => (
            <NavCard key={t.id} tab={t} onOpen={onOpen} />
          ))}
          {creator && <NavCard tab={TEAM_TAB} onOpen={onOpen} />}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-4 space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">
            Useful links
          </p>
          <LinkRow icon={ExternalLink} label="View live site" sub="Open the website in a new tab" href="/" external />
          <LinkRow icon={Users} label="Entry BAND" sub="Open the GFL entry BAND app" href={ENTRY_URL} external />
          <LinkRow icon={Users} label="Global Chat" sub="Open in-game global chat" href={GLOBAL_CHAT_URL} external />
          <LinkRow icon={KeyRound} label="Change password" sub="Update your own password" onOpen={() => onOpen("account")} />
        </div>

        <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-4 space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 mb-2">
            Text formatting cheatsheet
          </p>
          <CheatRow
            code="**text**"
            result={<span><b>bold text</b></span>}
          />
          <CheatRow
            code="__text__"
            result={<span className="text-red-600 underline underline-offset-2">red underlined</span>}
          />
          <CheatRow
            code="[label](#base-layouts)"
            result={<span className="text-red-600 underline underline-offset-2">a link</span>}
          />
          <CheatRow
            code="(blank line)"
            result={<span>starts a new paragraph</span>}
          />
        </div>
      </div>

      <p className="text-xs text-zinc-500 flex items-start gap-1.5 leading-5">
        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-zinc-400" aria-hidden="true" />
        Tip: your edits stay saved while you hop between tabs — nothing goes
        live until you press <b>Save &amp; publish</b>.
      </p>
    </div>
  );
}

function renderEditor(key: string) {
  switch (key) {
    case "home":
      return <HomeEditor />;
    case "overview":
      return <OverviewEditor />;
    case "how-to-join":
      return <HowToJoinEditor />;
    case "battle-style":
      return <BattleStyleEditor />;
    case "assistance":
      return <AssistanceEditor />;
    case "base-layouts":
      return <BaseLayoutsEditor />;
    case "opponents":
      return <OpponentsEditor />;
    default:
      return null;
  }
}

function Dashboard({ staff, onLogout }: { staff: Staff; onLogout: () => void }) {
  const [tab, setTab] = useState("start");
  const creator = isCreator(staff.role);

  return (
    <div className="gfl-card p-5 md:p-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-bold tracking-wide text-zinc-500 uppercase">
            Content Dashboard
          </p>
          <h3 className="display text-3xl mt-1">{staff.name}</h3>
          <p className="text-sm text-zinc-600 mt-1 flex items-center gap-2 flex-wrap">
            {staff.email}
            {creator ? (
              <Badge className="bg-red-600 text-white border border-red-600 hover:bg-red-700">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Creator
              </Badge>
            ) : (
              <Badge className="bg-stone-100 text-zinc-700 border border-stone-200 hover:bg-stone-200">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                {staff.role}
              </Badge>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank" rel="noreferrer">
              View site <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={ENTRY_URL} target="_blank" rel="noreferrer">
              Entry BAND <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={GLOBAL_CHAT_URL} target="_blank" rel="noreferrer">
              Global Chat <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex flex-wrap h-auto w-full gap-1 bg-stone-100 rounded-xl p-1.5">
          <TabsTrigger value="start" className={TRIGGER_CLS}>
            <Compass aria-hidden="true" />
            Start Here
          </TabsTrigger>
          {CONTENT_TABS.map((t) => {
            const Icon = t.icon;
            return (
              <TabsTrigger key={t.id} value={t.id} className={TRIGGER_CLS}>
                <Icon aria-hidden="true" />
                {t.label}
              </TabsTrigger>
            );
          })}
          <TabsTrigger value="account" className={TRIGGER_CLS}>
            <KeyRound aria-hidden="true" />
            Account
          </TabsTrigger>
          {creator && (
            <TabsTrigger value="team" className={TRIGGER_CLS}>
              <Users aria-hidden="true" />
              Team
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="start" forceMount className={CONTENT_CLS}>
          <StartHere name={staff.name} creator={creator} onOpen={setTab} />
        </TabsContent>

        {CONTENT_TABS.map((t) => (
          <TabsContent
            key={t.id}
            value={t.id}
            forceMount
            className={CONTENT_CLS}
          >
            <TabHeader {...t} />
            {renderEditor(t.id)}
          </TabsContent>
        ))}

        <TabsContent value="account" forceMount className={CONTENT_CLS}>
          <TabHeader {...ACCOUNT_TAB} />
          <AccountSettings role={staff.role} />
        </TabsContent>

        {creator && (
          <TabsContent value="team" forceMount className={CONTENT_CLS}>
            <TabHeader {...TEAM_TAB} />
            <TeamManager selfEmail={staff.email} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export function StaffView() {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [checking, setChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/staff/me")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setStaff(data.staff ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = useCallback(async () => {
    await fetch("/api/staff/logout", { method: "POST" }).catch(() => {});
    setStaff(null);
    toast({ title: "Signed out", description: "See you at the next sync!" });
  }, [toast]);

  return (
    <main className="grid-bg py-20 min-h-[70vh]">
      <div
        className={
          staff ? "max-w-3xl mx-auto px-5" : "max-w-md mx-auto px-5"
        }
      >
        <SectionTitle>{staff ? "Staff Dashboard" : "Staff Login"}</SectionTitle>
        {checking ? (
          <div className="gfl-card p-10 text-center" role="status">
            <Loader2
              className="h-6 w-6 mx-auto animate-spin text-red-600"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm text-zinc-600">Checking session…</p>
          </div>
        ) : staff ? (
          <Dashboard staff={staff} onLogout={handleLogout} />
        ) : (
          <LoginCard onSuccess={setStaff} />
        )}
      </div>
    </main>
  );
}
