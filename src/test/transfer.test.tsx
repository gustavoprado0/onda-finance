import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Transfer from "../pages/transfer";
import { useAuthStore } from "../store/auth.store";
import * as transactionsService from "../services/transactions";

vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

function renderTransfer() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <Transfer />
            </MemoryRouter>
        </QueryClientProvider>
    );
}

describe("Transfer — renderização", () => {
    beforeEach(() => {
        useAuthStore.setState({ user: "user@teste.com" });
    });

    it("deve renderizar os campos do formulário", () => {
        renderTransfer();
        expect(screen.getByPlaceholderText("Email do destinatário")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Ex: aluguel, pagamento de serviço...")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("0,00")).toBeInTheDocument();
    });

    it("deve renderizar o botão de confirmar", () => {
        renderTransfer();
        expect(
            screen.getByRole("button", { name: /confirmar transferência/i })
        ).toBeInTheDocument();
    });
});

describe("Transfer — validação", () => {
    beforeEach(() => {
        useAuthStore.setState({ user: "user@teste.com" });
    });

    it("deve exibir erro quando destinatário estiver vazio", async () => {
        renderTransfer();
        fireEvent.click(screen.getByRole("button", { name: /confirmar/i }));
        await waitFor(() => {
            expect(screen.getByText(/informe o destinatário/i)).toBeInTheDocument();
        });
    });

    it("deve exibir erro quando descrição estiver vazia", async () => {
        renderTransfer();
        await userEvent.type(screen.getByPlaceholderText("Email do destinatário"), "outro@teste.com");
        fireEvent.click(screen.getByRole("button", { name: /confirmar/i }));
        await waitFor(() => {
            expect(screen.getByText(/informe a descrição/i)).toBeInTheDocument();
        });
    });

    it("deve exibir erro quando valor for inválido", async () => {
        renderTransfer();
        await userEvent.type(screen.getByPlaceholderText("Email do destinatário"), "outro@teste.com");
        await userEvent.type(screen.getByPlaceholderText("Ex: aluguel, pagamento de serviço..."), "Pagamento");
        fireEvent.click(screen.getByRole("button", { name: /confirmar/i }));
        await waitFor(() => {
            expect(screen.getByText(/informe um valor/i)).toBeInTheDocument();
        });
    });

    it("não deve exibir erros com dados válidos", async () => {
        vi.spyOn(transactionsService, "createTransaction").mockResolvedValue({
            id: 1, title: "teste", amount: 100, type: "expense",
        });

        renderTransfer();
        await userEvent.type(screen.getByPlaceholderText("Email do destinatário"), "outro@teste.com");
        await userEvent.type(screen.getByPlaceholderText("Ex: aluguel, pagamento de serviço..."), "Pagamento");
        await userEvent.type(screen.getByPlaceholderText("0,00"), "100");
        fireEvent.click(screen.getByRole("button", { name: /confirmar/i }));

        await waitFor(() => {
            expect(screen.queryByText(/informe o destinatário/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/informe a descrição/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/valor deve ser maior/i)).not.toBeInTheDocument();
        });
    });
});