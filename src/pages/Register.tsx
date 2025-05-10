
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
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

// Define form schema with validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Il nome deve contenere almeno 2 caratteri.",
  }),
  email: z.string().email({ message: "Inserisci un indirizzo email valido." }),
  password: z.string().min(6, {
    message: "La password deve contenere almeno 6 caratteri.",
  }),
  confirmPassword: z.string(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Devi accettare i termini e le condizioni." }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non corrispondono.",
  path: ["confirmPassword"],
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically connect to your backend to register
    console.log(values);
    
    toast({
      title: "Registrazione completata",
      description: "Il tuo account è stato creato con successo!",
    });

    // Navigate to login page after successful registration
    setTimeout(() => {
      navigate("/login");
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
        {/* Left side - Registration form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Crea un account</h1>
              <p className="text-muted-foreground mt-2">Inizia la tua esperienza con YetiSight</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Mario Rossi" 
                            {...field} 
                            className="pl-10" 
                          />
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            type="email" 
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conferma password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                            className="pl-10" 
                          />
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <button 
                            type="button"
                            className="absolute right-3 top-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
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

                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          Accetto i <Link to="/terms" className="text-primary hover:underline">Termini di servizio</Link> e la <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full mt-6">
                  Registrati
                </Button>

                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground">
                    Hai già un account?{" "}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                      Accedi
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Right side - Image or promo content */}
        <div className="hidden md:block md:w-1/2">
          <div className="h-full flex flex-col items-center justify-center p-12 bg-gradient-to-r from-blue-50 to-blue-200 dark:from-gray-800 dark:to-gray-700">
            <div className="max-w-md text-center">
              <img 
                src="/lovable-uploads/bb761e52-8397-43ce-9518-ec654d50bd09.png"
                alt="YetiSight" 
                className="h-24 mx-auto mb-6" 
              />
              <h2 className="text-2xl font-bold mb-4">Unisciti a YetiSight</h2>
              <p className="text-muted-foreground mb-6">
                Crea un account per accedere a tutte le funzionalità e iniziare
                a monitorare le tue performance sulle piste da sci.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-lg shadow">
                  <h3 className="font-bold">Statistiche</h3>
                  <p className="text-sm">Visualizza e condividi le tue statistiche di sci</p>
                </div>
                <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-lg shadow">
                  <h3 className="font-bold">Comunità</h3>
                  <p className="text-sm">Partecipa agli eventi e incontra altri appassionati</p>
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

export default Register;
