"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STACK_URLS, saveAuth, validateToken } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [stackUrl, setStackUrl] = useState(STACK_URLS[0].value);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const isValid = await validateToken(stackUrl, token);
      
      if (isValid) {
        saveAuth({ stackUrl, token });
        router.push("/dashboard");
      } else {
        setError("Invalid token or connection failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary-500">
            Keboola Connection
          </CardTitle>
          <CardDescription className="text-center">
            Enter your API token to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="stack-url" className="text-sm font-medium">
                Stack URL
              </label>
              <Select value={stackUrl} onValueChange={setStackUrl}>
                <SelectTrigger id="stack-url">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STACK_URLS.map((stack) => (
                    <SelectItem key={stack.value} value={stack.value}>
                      {stack.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="token" className="text-sm font-medium">
                Storage API Token
              </label>
              <Input
                id="token"
                type="password"
                placeholder="Enter your API token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="font-mono text-sm"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600"
              disabled={isLoading || !token}
            >
              {isLoading ? "Connecting..." : "Connect"}
            </Button>
          </form>

          <div className="mt-4 text-xs text-center text-gray-500">
            Your token is stored locally and never sent to any server except Keboola APIs.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
