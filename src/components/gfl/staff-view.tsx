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
import { SectionTitle } from "@/components/gfl/section-title";
import { useToast } from "@/hooks/use-toast";

type Staff = {
  email: string;
  name: string;
  role: string;
  clanName: string | null;
};

const ENTRY_URL = "https://band.us/@gflentry";
const GLOBAL_CHAT_URL =
  "https://link.clashofclans.com/?action=OpenGlobalChat&chatId=Pfb0ca7b465354a2896bdf798cd9d72be";

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
        Demo accounts — <b>admin@gfl.gg / GFLstaff2026!</b> or{" "}
        <b>rep@gfl.gg / GFLrep2026!</b>
      </p>
    </div>
  );
}

function Dashboard({ staff, onLogout }: { staff: Staff; onLogout: () => void }) {
  return (
    <div className="gfl-card p-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-bold tracking-wide text-zinc-500 uppercase">
            Signed in
          </p>
          <h3 className="display text-3xl mt-1">{staff.name}</h3>
          <p className="text-sm text-zinc-600 mt-1">{staff.email}</p>
        </div>
        <Badge className="bg-red-50 text-red-700 border border-red-100 hover:bg-red-100">
          <ShieldCheck className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
          {staff.role}
        </Badge>
      </div>

      {staff.clanName && (
        <p className="mt-3 text-sm text-zinc-600">
          Clan / Org: <b>{staff.clanName}</b>
        </p>
      )}

      <Separator className="my-6" />

      <div className="grid sm:grid-cols-2 gap-4">
        <a
          href={ENTRY_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-red-100 bg-red-50/60 p-4 hover:border-red-200 transition-colors"
        >
          <b className="text-red-700">GFL Entry BAND</b>
          <p className="text-sm text-zinc-600 mt-1 flex items-center gap-1">
            Onboarding lounge <ExternalLink className="h-3 w-3" />
          </p>
        </a>
        <a
          href={GLOBAL_CHAT_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-stone-200 bg-stone-50 p-4 hover:border-stone-300 transition-colors"
        >
          <b>GFL Global Chat</b>
          <p className="text-sm text-zinc-600 mt-1 flex items-center gap-1">
            In-game coordination <ExternalLink className="h-3 w-3" />
          </p>
        </a>
      </div>

      <Button
        variant="outline"
        onClick={onLogout}
        className="w-full mt-6 py-3 rounded-xl font-bold h-auto"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Sign out
      </Button>
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
      <div className="max-w-md mx-auto px-5">
        <SectionTitle>Staff Login</SectionTitle>
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
