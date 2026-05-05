import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { Film, Loader2, LogIn, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";

const FEATURES = [
  { icon: "🎬", text: "Multi-track timeline editing" },
  { icon: "✨", text: "Keyframe animations on any property" },
  { icon: "🎨", text: "Effects, transitions & color filters" },
  { icon: "☁️", text: "Auto-save with cloud sync" },
];

export default function LoginPage() {
  const { login, loginStatus, isAuthenticated, isInitializing } =
    useInternetIdentity();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLoading = loginStatus === "logging-in";

  // Redirect if already authenticated
  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  async function handleIILogin() {
    await login();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen w-screen bg-background flex overflow-hidden">
      {/* Left branding panel */}
      <motion.div
        className="hidden lg:flex flex-col justify-between w-1/2 bg-card border-r border-border p-12 relative overflow-hidden"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Film className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            ClipCraft
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            aria-label="Toggle theme"
            data-ocid="login.theme_toggle"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="relative space-y-8">
          <div>
            <h1 className="font-display font-bold text-4xl text-foreground leading-tight">
              Professional video editing,{" "}
              <span className="text-primary">free forever.</span>
            </h1>
            <p className="mt-3 text-muted-foreground text-lg">
              Browser-based. No downloads. No paywalls.
            </p>
          </div>
          <ul className="space-y-3">
            {FEATURES.map((f) => (
              <li key={f.text} className="flex items-center gap-3">
                <span className="text-xl">{f.icon}</span>
                <span className="text-foreground/80 text-sm">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} ClipCraft. Built with{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>

      {/* Right auth form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-sm space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        >
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Film className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              ClipCraft
            </span>
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl text-foreground">
              {tab === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {tab === "login"
                ? "Sign in to continue to your projects"
                : "Start editing for free today"}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex rounded-lg bg-muted p-1 gap-1" role="tablist">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                data-ocid={`auth.${t}_tab`}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-smooth ${
                  tab === t
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "login" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Email/password form */}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleIILogin();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="auth-email">Email</Label>
              <Input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                data-ocid="auth.email_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="auth-password">Password</Label>
              <Input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  tab === "login" ? "current-password" : "new-password"
                }
                data-ocid="auth.password_input"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-ocid="auth.email_submit_button"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {!isLoading && <LogIn className="w-4 h-4 mr-2" />}
              {tab === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-background text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleIILogin}
            disabled={isLoading}
            type="button"
            data-ocid="auth.ii_login_button"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-primary" />
            )}
            Continue with Internet Identity
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By continuing you agree to our terms of service and privacy policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
