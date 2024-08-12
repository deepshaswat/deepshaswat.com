"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui";

export const CustomSignIn: React.FC = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      await setActive({ session: result.createdSessionId });
      window.location.href = "/"; // Redirect to the dashboard or any protected route
    } catch (err: any) {
      setError(err.errors ? err.errors[0].message : "Sign-in failed");
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in to blog-admin</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSignIn}>
          <div className="mb-4 grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-600">User Not Allowed</p>}
          <Button className="w-full" type="submit">
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
