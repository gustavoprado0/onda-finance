import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { loginSchema, type LoginSchema } from "../../schemas/login.schema";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Loader2, Waves } from "lucide-react";

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    login(data.email);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-zinc-950">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-cyan-950 via-zinc-900 to-zinc-950 items-end p-12">
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full border border-cyan-500/10" />
        <div className="absolute top-[-40px] left-[-40px] w-[300px] h-[300px] rounded-full border border-cyan-500/10" />
        <div className="absolute bottom-[20%] right-[-100px] w-[350px] h-[350px] rounded-full border border-cyan-500/10" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Waves size={20} className="text-cyan-400" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Onda Finance
            </span>
          </div>
          <h2 className="text-4xl font-bold !text-white leading-tight mb-4">
            Seu dinheiro,
            <br />
            <span className="text-cyan-400">no fluxo certo.</span>
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
            Gerencie transferências, acompanhe transações e tenha controle
            total das suas finanças em um só lugar.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Waves size={18} className="text-cyan-400" />
            </div>
            <span className="text-white font-bold text-lg">Onda Finance</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold !text-white">Bem-vindo de volta</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Entre com suas credenciais para acessar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Email
              </label>
              <Input
                placeholder="seu@email.com"
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500/40 focus-visible:border-cyan-500/60 h-11"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-400 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Senha
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500/40 focus-visible:border-cyan-500/60 h-11"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-400 text-xs">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold transition-all duration-200 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-zinc-600">
            Use qualquer email válido + senha com 6+ caracteres
          </p>
        </div>
      </div>
    </div>
  );
}