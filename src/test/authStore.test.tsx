import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../store/auth.store";

describe("auth.store", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null });
  });

  it("deve iniciar com user null", () => {
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("deve logar e salvar o usuário", () => {
    useAuthStore.getState().login("user@teste.com");
    expect(useAuthStore.getState().user).toBe("user@teste.com");
  });

  it("deve fazer logout e zerar o usuário", () => {
    useAuthStore.getState().login("user@teste.com");
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
  });
});