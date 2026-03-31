import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/login";
import { useAuthStore } from "../store/auth.store";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe("Login — renderização", () => {
  it("deve renderizar campos de email e senha", () => {
    renderLogin();
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("deve renderizar o botão de submit", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });
});

describe("Login — validação", () => {
  it("deve exibir erro ao submeter email inválido", async () => {
    renderLogin();
    await userEvent.type(screen.getByPlaceholderText("seu@email.com"), "nao-e-um-email");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "123456");
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });

  it("deve exibir erro quando senha tiver menos de 6 caracteres", async () => {
    renderLogin();
    await userEvent.type(screen.getByPlaceholderText("seu@email.com"), "user@teste.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "123");
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    await waitFor(() => {
      expect(screen.getByText(/mínimo 6 caracteres/i)).toBeInTheDocument();
    });
  });

  it("não deve exibir erros com dados válidos", async () => {
    renderLogin();
    await userEvent.type(screen.getByPlaceholderText("seu@email.com"), "user@teste.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "senha123");
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));
    await waitFor(() => {
      expect(screen.queryByText(/email inválido/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/mínimo 6 caracteres/i)).not.toBeInTheDocument();
    });
  });
});

describe("Login — fluxo de autenticação", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null });
    mockNavigate.mockClear();
  });

  it("deve salvar usuário no store após login", () => {
    useAuthStore.getState().login("user@teste.com");
    expect(useAuthStore.getState().user).toBe("user@teste.com");
  });

  it("deve limpar usuário no store após logout", () => {
    useAuthStore.getState().login("user@teste.com");
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("deve exibir 'Entrando...' enquanto processa o submit", async () => {
    renderLogin();

    await userEvent.type(screen.getByPlaceholderText("seu@email.com"), "user@teste.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "senha123");
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /entrando/i })).toBeInTheDocument();
    });
  });
});