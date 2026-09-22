"use client";

import { useState } from "react";
import { Loader2, KeyRound, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

/**
 * Change your OWN password — available to every signed-in staff member.
 * Editing other people's profiles/roles is Creator-only (Team tab).
 */
export function AccountSettings({ role }: { role: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The two new passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/staff/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not update the password.");
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password updated",
        description: "Use the new password the next time you sign in.",
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="gfl-card p-6">
        <h4 className="display text-2xl">Change your password</h4>
        <p className="text-sm text-zinc-600 mt-1">
          Every staff member can update their own password here.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3 max-w-md" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="pw-current">Current password</Label>
            <Input
              id="pw-current"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw-new">New password (min 8 characters)</Label>
            <Input
              id="pw-new"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw-confirm">Confirm new password</Label>
            <Input
              id="pw-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={busy || !currentPassword || !newPassword || !confirmPassword}
            className="gfl-btn font-bold"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            Update password
          </Button>
        </form>
      </div>

      <div className="gfl-card p-5 flex gap-3 items-start">
        <Info className="h-5 w-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-sm text-zinc-600">
          <p>
            You are signed in as <b>{role}</b>.
            {role === "Creator"
              ? " As the Creator you can edit all website content and manage every staff profile under the Team tab."
              : " Admins can edit all website content. Registering profiles or changing other members' roles is reserved for the Creator."}
          </p>
        </div>
      </div>
    </div>
  );
}
