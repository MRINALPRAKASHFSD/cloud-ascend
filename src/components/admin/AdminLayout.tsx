import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Boxes,
  Images,
  Trophy,
  Megaphone,
  Quote,
  BarChart3,
  GraduationCap,
  Phone,
  Link2,
  LogOut,
  Cloud,
  Home,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuroraBackground } from "@/components/site/AuroraBackground";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/members", label: "Members", icon: Users },
  { to: "/admin/projects", label: "Projects", icon: Boxes },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/achievements", label: "Achievements", icon: Trophy },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/hero-stats", label: "Hero Stats", icon: BarChart3 },
  { to: "/admin/faculty", label: "Faculty", icon: GraduationCap },
  { to: "/admin/contact", label: "Contact", icon: Phone },
  { to: "/admin/footer", label: "Footer Links", icon: Link2 },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return <ClaimAdminPrompt onSignOut={signOut} />;
  }

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="glass-strong sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 p-4 md:flex">
          <Link to="/" className="mb-6 flex items-center gap-2 px-2 py-2">
            <div className="glass grid h-9 w-9 place-items-center rounded-xl">
              <Cloud className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">CoE Cloud</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin</div>
            </div>
          </Link>

          <nav className="flex-1 space-y-0.5 overflow-y-auto">
            {nav.map((n) => {
              const active = n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to);
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-nav-active"
                      className="glass absolute inset-0 -z-10 rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="glass mt-4 space-y-2 rounded-2xl p-3 text-xs">
            <div className="truncate text-muted-foreground">{user?.email}</div>
            <div className="flex items-center gap-1.5">
              <Link
                to="/"
                className="glass flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-white/10"
              >
                <Home className="h-3 w-3" /> Site
              </Link>
              <ThemeToggle />
              <button
                onClick={signOut}
                className="glass flex items-center justify-center gap-1.5 rounded-full px-2 py-1.5 hover:bg-white/10"
                aria-label="Sign out"
              >
                <LogOut className="h-3 w-3" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="glass-strong sticky top-0 z-20 flex w-full items-center gap-3 border-b border-white/10 px-4 py-3 md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            <span className="text-sm font-semibold">CoE Admin</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <button onClick={signOut} className="glass grid h-8 w-8 place-items-center rounded-full"><LogOut className="h-3.5 w-3.5" /></button>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-6xl px-6 py-10 md:py-12">{children}</div>
          {/* Mobile bottom nav */}
          <div className="glass-strong sticky bottom-0 z-20 flex overflow-x-auto border-t border-white/10 p-2 md:hidden">
            {nav.map((n) => {
              const active = n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to);
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex shrink-0 flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

function ClaimAdminPrompt({ onSignOut }: { onSignOut: () => void }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useAdminClaimState();

  const claim = async () => {
    setBusy(true);
    try {
      const { claimAdmin } = await import("@/lib/admin.functions");
      const res = await claimAdmin();
      if (!res.ok) {
        toast.error("An admin already exists. Ask them to grant you access.");
      } else {
        toast.success("Admin access granted");
        window.location.reload();
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not claim admin");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <div className="relative z-10 grid min-h-screen place-items-center px-6">
        <div className="glass-strong w-full max-w-md rounded-3xl p-8 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account is signed in but doesn't yet have admin access. If you're the first admin, claim it now.
          </p>
          <button
            onClick={claim}
            disabled={busy}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Claim admin access"}
          </button>
          <div className="mt-4 flex items-center justify-center gap-3 text-xs">
            <button onClick={() => navigate({ to: "/" })} className="text-muted-foreground hover:text-foreground">Back to site</button>
            <span className="text-white/20">·</span>
            <button onClick={onSignOut} className="text-muted-foreground hover:text-foreground">Sign out</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// tiny local state hook to keep the file self-contained
import { useState } from "react";
function useAdminClaimState() { return useState(false); }
