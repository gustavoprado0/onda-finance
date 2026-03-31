import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "../pages/dashboard";
import { useAuthStore } from "../store/auth.store";
import * as transactionsService from "../services/transactions";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Dashboard — renderização", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: "user@teste.com" });
  });

  it("deve renderizar os cards de saldo, entradas e saídas", async () => {
    vi.spyOn(transactionsService, "getTransactions").mockResolvedValue([]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Saldo Total")).toBeInTheDocument();
      expect(screen.getByText("Entradas")).toBeInTheDocument();
      expect(screen.getByText("Saídas")).toBeInTheDocument();
    });
  });

  it("deve exibir saldo zerado quando não há transações", async () => {
    vi.spyOn(transactionsService, "getTransactions").mockResolvedValue([]);

    renderDashboard();

    await waitFor(() => {
      const zeros = screen.getAllByText((content) =>
        content.replace(/\s/g, " ") === "R$ 0,00"
      );
      expect(zeros.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("deve calcular saldo corretamente com transações", async () => {
    vi.spyOn(transactionsService, "getTransactions").mockResolvedValue([
      { id: 1, title: "Salário", amount: 3000, type: "income" },
      { id: 2, title: "Aluguel", amount: 1000, type: "expense" },
    ]);

    renderDashboard();

    const findBRL = (value: string) =>
      screen.getByText((content) => content.replace(/\s/g, " ") === value);

    await waitFor(() => {
      expect(findBRL("R$ 2.000,00")).toBeInTheDocument(); 
      expect(findBRL("R$ 3.000,00")).toBeInTheDocument(); 
      expect(findBRL("R$ 1.000,00")).toBeInTheDocument(); 
    });
  });

  it("deve listar as transações na tabela", async () => {
    vi.spyOn(transactionsService, "getTransactions").mockResolvedValue([
      { id: 1, title: "Freelance React", amount: 500, type: "income" },
      { id: 2, title: "Conta de luz", amount: 150, type: "expense" },
    ]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText("Freelance React")).toBeInTheDocument();
      expect(screen.getByText("Conta de luz")).toBeInTheDocument();
    });
  });

  it("deve exibir mensagem quando não há transações", async () => {
    vi.spyOn(transactionsService, "getTransactions").mockResolvedValue([]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/nenhuma transação ainda/i)).toBeInTheDocument();
    });
  });
});