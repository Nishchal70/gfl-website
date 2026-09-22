"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LogOut,
  ShieldCheck,
  Loader2,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionTitle } from "@/components/gfl/section-title";
import { useToast } from "@/hooks/use-toast";
import { HomeEditor, OverviewEditor } from "@/components/gfl/dashboard/editors-home";
import {
  AssistanceEditor,
  BaseLayoutsEditor,
  BattleStyleEditor,
  HowToJoinEditor,
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

const DASHBOARD_TABS: { key: string; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "overview", label: "Overview" },
  { key: "how-to-join", label: "How to Join" },
  { key: "battle-style", label: "Battle Style" },
  { key: "assistance", label: "Assistance" },
  { key: "base-layouts", label: "Base Layouts" },
];

function LoginCard({ onSuccess }: { onSuccess: (staff: Staff) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="gfl-card p-8">
      <div className="flex items-center gap-2 text-zinc-700">
        <KeyRound className="h-5 w-5 text-red-600" aria-hidden="true" />
        <p className="text-sm">
          Staff access is protected by real session authentication — sign in
          with the credentials issued by GFL leadership.
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
          />
        </div>
        <div className="space-y-1.5 mt-4">
          <Label htmlFor="staff-password">Password</Label>
          <Input
            id="staff-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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

      <p className="mt-5 text-xs text-zinc-500 text-center">
        Demo admin account — <b>admin@gfl.gg / GFLstaff2026!</b>
      </p>
    </div>
  );
}

function Dashboard({ staff, onLogout }: { staff: Staff; onLogout: () => void }) {
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
            {isCreator(staff.role) ? (
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
        <div className="flex items-center gap-2">
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

      <p className="text-sm text-zinc-600 mb-4">
        Edit the content of any page below, then press{" "}
        <b>Save &amp; publish</b> — changes go live immediately for every
        visitor. Rich text: <code className="bg-stone-100 rounded px-1">**bold**</code>,{" "}
        <code className="bg-stone-100 rounded px-1">__red underline__</code>,{" "}
        <code className="bg-stone-100 rounded px-1">[link text](#base-layouts)</code>,
        blank line for a new paragraph.
      </p>

      <Tabs defaultValue="home">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-stone-100 rounded-xl p-1">
          {DASHBOARD_TABS.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
          {isCreator(staff.role) && (
            <TabsTrigger
              value="team"
              className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-sm"
            >
              Team
            </TabsTrigger>
          )}
          <TabsTrigger
            value="account"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-sm"
          >
            Account
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home" className="mt-6">
          <HomeEditor />
        </TabsContent>
        <TabsContent value="overview" className="mt-6">
          <OverviewEditor />
        </TabsContent>
        <TabsContent value="how-to-join" className="mt-6">
          <HowToJoinEditor />
        </TabsContent>
        <TabsContent value="battle-style" className="mt-6">
          <BattleStyleEditor />
        </TabsContent>
        <TabsContent value="assistance" className="mt-6">
          <AssistanceEditor />
        </TabsContent>
        <TabsContent value="base-layouts" className="mt-6">
          <BaseLayoutsEditor />
        </TabsContent>
        {isCreator(staff.role) && (
          <TabsContent value="team" className="mt-6">
            <TeamManager selfEmail={staff.email} />
          </TabsContent>
        )}
        <TabsContent value="account" className="mt-6">
          <AccountSettings role={staff.role} />
        </TabsContent>
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
