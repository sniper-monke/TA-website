import { webcrypto, pbkdf2Sync } from "node:crypto";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  current: { data: {} as { email?: string; version?: string }, clear: vi.fn(), update: vi.fn() },
  catalogue: vi.fn(),
}));
vi.mock("@tanstack/react-start/server", () => ({
  useSession: async () => mocks.current,
  setResponseHeader: vi.fn(),
}));
vi.mock("./catalogue.server", () => ({
  catalogue: mocks.catalogue,
  importReport: {},
  importedProducts: [],
}));
import { verifyPassword, login, identity, dashboard, logout } from "./admin.server";
const hash = `pbkdf2:600000:test-salt:${pbkdf2Sync("correct-password", "test-salt", 600000, 32, "sha256").toString("hex")}`;
beforeEach(() => {
  mocks.current.data = {};
  vi.clearAllMocks();
  vi.stubGlobal("crypto", webcrypto);
  vi.stubEnv("ADMIN_EMAIL", "admin@example.com");
  vi.stubEnv("ADMIN_PASSWORD_HASH", hash);
  vi.stubEnv("ADMIN_SESSION_SECRET", "a-long-private-secret-with-at-least-32-characters");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe("Admin access", () => {
  it("accepts a matching hash and rejects incorrect or malformed passwords", async () => {
    expect(await verifyPassword("correct-password", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
    expect(await verifyPassword("correct-password", "invalid")).toBe(false);
  });
  it("denies dashboard access before reading store data", async () => {
    expect(await identity()).toBeNull();
    await expect(dashboard()).rejects.toThrow("Sign in");
    expect(mocks.catalogue).not.toHaveBeenCalled();
  });
  it("rejects a wrong email even with the correct password", async () => {
    await expect(login("other@example.com", "correct-password")).rejects.toThrow("incorrect");
    expect(mocks.current.update).not.toHaveBeenCalled();
  });
  it("creates a fresh session on successful login and clears it on logout", async () => {
    await login("ADMIN@example.com", "correct-password");
    expect(mocks.current.clear).toHaveBeenCalledOnce();
    expect(mocks.current.update).toHaveBeenCalledWith({
      email: "admin@example.com",
      version: hash,
    });
    mocks.current.data = { email: "admin@example.com", version: hash };
    expect(await identity()).toEqual({ email: "admin@example.com" });
    vi.stubEnv("ADMIN_PASSWORD_HASH", "rotated");
    expect(await identity()).toBeNull();
    await logout();
    expect(mocks.current.clear).toHaveBeenCalledTimes(2);
  });
});
