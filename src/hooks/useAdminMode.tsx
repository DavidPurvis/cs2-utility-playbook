/**
 * Admin mode context.
 *
 * The CMS is gated by a single hardcoded password baked into the
 * bundle. This isn't real security — it's just a "don't accidentally
 * edit production data" gate on a personal GitHub Pages site. Change
 * `ADMIN_PASSWORD` below to whatever you want.
 *
 * Entry points:
 *   - URL param `?admin=1` → opens the password prompt automatically
 *   - "Admin" link in the footer → same prompt
 *
 * Once authenticated, `isAdmin` flips true for the rest of the session
 * (persisted to sessionStorage so a refresh keeps you in). Logging out
 * (or closing the tab) clears it.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** Override me. Keep simple — this is anti-misclick, not anti-attacker. */
export const ADMIN_PASSWORD = "dust2";

const SESSION_KEY = "cs2-playbook/admin";

interface AdminContextValue {
  isAdmin: boolean;
  promptOpen: boolean;
  loginError: string | null;
  openPrompt: () => void;
  closePrompt: () => void;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function readSessionFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSessionFlag(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (value) window.sessionStorage.setItem(SESSION_KEY, "1");
    else window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

function urlHasAdminParam(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get("admin") === "1";
  } catch {
    return false;
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => readSessionFlag());
  const [promptOpen, setPromptOpen] = useState<boolean>(() => urlHasAdminParam() && !readSessionFlag());
  const [loginError, setLoginError] = useState<string | null>(null);

  // Persist admin flag across refreshes within the same tab session.
  useEffect(() => {
    writeSessionFlag(isAdmin);
  }, [isAdmin]);

  const openPrompt = useCallback(() => {
    setLoginError(null);
    setPromptOpen(true);
  }, []);
  const closePrompt = useCallback(() => {
    setPromptOpen(false);
    setLoginError(null);
  }, []);
  const login = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setPromptOpen(false);
      setLoginError(null);
      return true;
    }
    setLoginError("Wrong password.");
    return false;
  }, []);
  const logout = useCallback(() => {
    setIsAdmin(false);
    setPromptOpen(false);
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({ isAdmin, promptOpen, loginError, openPrompt, closePrompt, login, logout }),
    [isAdmin, promptOpen, loginError, openPrompt, closePrompt, login, logout]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminMode(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdminMode must be used inside <AdminProvider>");
  return ctx;
}
