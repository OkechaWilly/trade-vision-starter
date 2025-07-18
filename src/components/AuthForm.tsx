import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./auth/LoginForm";
import { SignupForm } from "./auth/SignupForm";
import { SocialAuthButtons } from "./auth/SocialAuthButtons";
import { PasswordResetForm } from "./auth/PasswordResetForm";

export const AuthForm = () => {

  return (
    <Card className="w-full max-w-md mx-auto auth-card">
      <CardHeader className="text-center">
        <CardTitle>Welcome to JournalIQ</CardTitle>
        <CardDescription>
          Sign in to your account or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="reset">Reset</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
          
          <TabsContent value="reset">
            <PasswordResetForm />
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <SocialAuthButtons />
        </div>
      </CardContent>
    </Card>
  );
};