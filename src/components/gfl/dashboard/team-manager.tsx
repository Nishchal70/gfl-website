"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ROLES, type StaffRole } from "@/lib/staff-roles";

export type TeamMember = {
  id: string;
  email: string;
  name: string;
  role: string;
  clanName: string | null;
  createdAt?: string;
};

const emptyForm = {
  name: "",
  email: "",
  role: "Admin" as StaffRole,
  clanName: "",
  password: "",
};

function RoleBadge({ role }: { role: string }) {
  const isCreator = role === "Creator";
  return (
    <Badge
      className={
        isCreator
          ? "bg-red-600 text-white border border-red-600 hover:bg-red-700"
          : "bg-stone-100 text-zinc-700 border border-stone-200 hover:bg-stone-200"
      }
    >
      {role}
    </Badge>
  );
}

/** Creator-only staff management: register, edit roles/profiles, remove. */
export function TeamManager({ selfEmail }: { selfEmail: string }) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [addError, setAddError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addBusy, setAddBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "Admin" as StaffRole,
    clanName: "",
    password: "",
  });
  const { toast } = useToast();

  const load = useCallback(async () => {
    const res = await fetch("/api/staff/manage");
    const data = await res.json().catch(() => ({ members: [] }));
    setMembers(res.ok ? data.members : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    setAddError(null);
    setAddBusy(true);
    try {
      const res = await fetch("/api/staff/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          role: form.role,
          clanName: form.clanName || null,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error ?? "Could not create the account.");
        return;
      }
      setMembers((prev) => [...prev, data.member]);
      setAddOpen(false);
      setForm(emptyForm);
      toast({
        title: "Profile created",
        description: `${data.member.name} can now sign in as ${data.member.role}.`,
      });
    } catch {
      setAddError("Network error. Please try again.");
    } finally {
      setAddBusy(false);
    }
  };

  const openEdit = (member: TeamMember) => {
    setEditError(null);
    setEditId(member.id);
    setEditForm({
      name: member.name,
      email: member.email,
      role: (member.role === "Creator" ? "Creator" : "Admin") as StaffRole,
      clanName: member.clanName ?? "",
      password: "",
    });
  };

  const handleEdit = async () => {
    if (!editId) return;
    setEditError(null);
    setEditBusy(true);
    try {
      const res = await fetch(`/api/staff/manage/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          role: editForm.role,
          clanName: editForm.clanName || null,
          ...(editForm.password ? { password: editForm.password } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error ?? "Could not update the profile.");
        return;
      }
      setMembers((prev) =>
        prev.map((m) => (m.id === editId ? { ...m, ...data.member } : m))
      );
      setEditId(null);
      toast({ title: "Profile updated", description: data.member.name });
    } catch {
      setEditError("Network error. Please try again.");
    } finally {
      setEditBusy(false);
    }
  };

  const handleDelete = async (member: TeamMember) => {
    const res = await fetch(`/api/staff/manage/${member.id}`, {
      method: "DELETE",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast({
        title: "Could not remove account",
        description: data.error ?? "Please try again.",
        variant: "destructive",
      });
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== member.id));
    toast({
      title: "Account removed",
      description: `${member.name} no longer has staff access.`,
    });
  };

  if (loading) {
    return (
      <div className="gfl-card p-10 text-center" role="status">
        <Loader2 className="h-6 w-6 mx-auto animate-spin text-red-600" aria-hidden="true" />
        <p className="mt-3 text-sm text-zinc-600">Loading team…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="gfl-card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h4 className="display text-2xl">Team management</h4>
            <p className="text-sm text-zinc-600 mt-1 max-w-xl">
              As the <b>Creator</b>, only you can register new profiles and edit
              another member&apos;s profile or role. Admins can edit website
              content and change their own password.
            </p>
          </div>
          <Button onClick={() => { setAddError(null); setAddOpen(true); }} className="gfl-btn font-bold">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add staff member
          </Button>
        </div>

        <div className="mt-5 divide-y divide-stone-100 border border-stone-100 rounded-xl overflow-hidden">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 p-4 bg-white flex-wrap"
            >
              <div className="min-w-0">
                <p className="font-bold flex items-center gap-2 flex-wrap">
                  {member.name}
                  <RoleBadge role={member.role} />
                  {member.email === selfEmail && (
                    <Badge variant="outline" className="text-zinc-500 border-stone-200">
                      you
                    </Badge>
                  )}
                </p>
                <p className="text-sm text-zinc-600 truncate">
                  {member.email}
                  {member.clanName ? ` · ${member.clanName}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => openEdit(member)}>
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  Edit
                </Button>
                {member.email !== selfEmail && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove {member.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          They will immediately lose staff access. This cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(member)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Remove account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Register a new profile */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="display text-2xl">New staff profile</DialogTitle>
            <DialogDescription>
              The member signs in with this email and password right away.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="new-name">Name</Label>
              <Input
                id="new-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Rohit"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="member@gfl.gg"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="new-role">Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm({ ...form, role: v as StaffRole })}
                >
                  <SelectTrigger id="new-role" className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-clan">Clan (optional)</Label>
                <Input
                  id="new-clan"
                  value={form.clanName}
                  onChange={(e) => setForm({ ...form, clanName: e.target.value })}
                  placeholder="Farm Squad One"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">Password (min 8 characters)</Label>
              <Input
                id="new-password"
                type="text"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Set a starting password"
              />
            </div>
            {addError && (
              <Alert variant="destructive">
                <AlertDescription>{addError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={addBusy || !form.name || !form.email || form.password.length < 8}
              className="gfl-btn font-bold"
            >
              {addBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <UserCog className="h-4 w-4" aria-hidden="true" />
              )}
              Create profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit an existing profile */}
      <Dialog open={editId !== null} onOpenChange={(open) => !open && setEditId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="display text-2xl">Edit profile</DialogTitle>
            <DialogDescription>
              Update the profile, change the role, or set a new password. Leave
              the password blank to keep it unchanged.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(v) => setEditForm({ ...editForm, role: v as StaffRole })}
                >
                  <SelectTrigger id="edit-role" className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-clan">Clan (optional)</Label>
                <Input
                  id="edit-clan"
                  value={editForm.clanName}
                  onChange={(e) => setEditForm({ ...editForm, clanName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-password">New password (optional)</Label>
              <Input
                id="edit-password"
                type="text"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                placeholder="Leave blank to keep the current password"
              />
            </div>
            {editError && (
              <Alert variant="destructive">
                <AlertDescription>{editError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditId(null)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={editBusy} className="gfl-btn font-bold">
              {editBusy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
