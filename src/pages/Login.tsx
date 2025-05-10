
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

// Define form schema with validation
const formSchema = z.object({
  email: z.string().email({ message: "Inserisci un indirizzo email valido." }),
  password: z.string().min(6, {
    message: "La password deve contenere almeno 6 caratteri.",
  }),
  rememberMe: z.boolean().default(false),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically connect to your backend for authentication
    // For now, we'll simulate a successful login
    console.log(values);
    
    // Show success toast
    toast({
      title: "Accesso effettuato",
      description: "Benvenuto su YetiSight!",
    });

    // Navigate to dashboard after successful login
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with logo */}
      <header className="w-full bg-white dark:bg-gray-900 border-b border-snow-200 dark:border-gray-800 py-4">
        <div className="container flex justify-center">
          <Link to="/">
            <img 
              src="/lovable-uploads/bb761e52-8397-43ce-9518-ec654d50bd09.png" 
              alt="YetiSight" 
              className="h-10" 
            />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Left side - Login form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Bentornato</h1>
              <p className="text-muted-foreground mt-2">Accedi al tuo account YetiSight</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="nome@esempio.com" 
                            {...field} 
                            className="pl-10" 
                          />
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                            className="pl-10" 
                          />
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <button 
                            type="button"
                            className="absolute right-3 top-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="rememberMe" 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <label 
                          htmlFor="rememberMe" 
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          Ricordami
                        </label>
                      </div>
                    )}
                  />
                  
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Password dimenticata?
                  </Link>
                </div>

                <Button type="submit" className="w-full">
                  Accedi
                </Button>

                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground">
                    Non hai un account?{" "}
                    <Link 
                      to="/register" 
                      className="font-medium text-primary hover:underline"
                    >
                      Registrati
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Right side - Image or promo content */}
        <div className="hidden md:block md:w-1/2 bg-blue-100 dark:bg-gray-800">
          <div className="h-full flex flex-col items-center justify-center p-12 bg-gradient-to-r from-blue-50 to-blue-200 dark:from-gray-800 dark:to-gray-700">
            <div className="max-w-md text-center">
              <img 
                src="/lovable-uploads/bb761e52-8397-43ce-9518-ec654d50bd09.png" 
                alt="YetiSight" 
                className="h-24 mx-auto mb-6" 
              />
              <h2 className="text-2xl font-bold mb-4">Benvenuto su YetiSight</h2>
              <p className="text-muted-foreground mb-6">
                La piattaforma intelligente che ti accompagna sulle piste da sci, 
                garantendo sicurezza e migliorando la tua esperienza.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-lg shadow">
                  <h3 className="font-bold">Tracciamento</h3>
                  <p className="text-sm">Monitora le tue performance e migliora la tua tecnica</p>
                </div>
                <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-lg shadow">
                  <h3 className="font-bold">Sicurezza</h3>
                  <p className="text-sm">Rileva eventuali ostacoli e ricevi avvisi in tempo reale</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-snow-200 dark:border-gray-800 p-4">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} YetiSight. Tutti i diritti riservati.
        </div>
      </footer>
    </div>
  );
};

export default Login;
