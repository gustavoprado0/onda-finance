import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { loginSchema, type LoginSchema } from "../../schemas/login.schema";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";


export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema) => {
    login(data.email);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <div className="w-full max-w-sm space-y-6">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold">Bem-vindo</h1>
          <p className="text-sm text-muted-foreground">
            Entre com sua conta para continuar
          </p>
        </div>
  
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 border bg-background p-6 rounded-2xl shadow-sm"
        >
          <div className="space-y-2">
            <Input placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>
  
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Senha"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
  
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}