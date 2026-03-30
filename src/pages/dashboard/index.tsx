import { Button } from "../../components/ui/button";
import { useAuthStore } from "../../store/auth.store";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="w-full min-h-screen bg-muted/40 p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {user}
          </span>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="p-6 rounded-2xl bg-background shadow-sm">
          <p className="text-sm text-muted-foreground">Saldo disponível</p>
          <h2 className="text-2xl font-bold mt-2">R$ 5.240,00</h2>
        </div>

        <div className="p-6 rounded-2xl bg-background shadow-sm">
          <p className="text-sm text-muted-foreground">Entradas</p>
          <h2 className="text-2xl font-bold mt-2 text-green-600">
            + R$ 2.000,00
          </h2>
        </div>

        <div className="p-6 rounded-2xl bg-background shadow-sm">
          <p className="text-sm text-muted-foreground">Saídas</p>
          <h2 className="text-2xl font-bold mt-2 text-red-600">
            - R$ 750,00
          </h2>
        </div>

      </div>

      <div className="bg-background rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          Últimas transações
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Venda produto</span>
            <span className="text-green-600">+ R$ 500</span>
          </div>

          <div className="flex justify-between">
            <span>Assinatura software</span>
            <span className="text-red-600">- R$ 50</span>
          </div>

          <div className="flex justify-between">
            <span>Freelance</span>
            <span className="text-green-600">+ R$ 1.500</span>
          </div>
        </div>
      </div>
    </div>
  );
}