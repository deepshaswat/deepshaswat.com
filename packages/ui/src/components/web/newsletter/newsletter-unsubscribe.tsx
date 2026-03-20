"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { Loader2, Mail, CheckCircle2, XCircle } from "lucide-react";
import { unsubscribeMember, verifyAndUnsubscribe } from "@repo/actions";

interface NewsletterUnsubscribeProps {
  email?: string;
  token?: string;
}

export const NewsletterUnsubscribe = ({
  email: initialEmail,
  token,
}: NewsletterUnsubscribeProps) => {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail || "");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-verify if email and token are provided (from newsletter link)
  useEffect(() => {
    if (initialEmail && token) {
      setStatus("loading");
      verifyAndUnsubscribe(initialEmail, token)
        .then((result) => {
          if (result.success) {
            setStatus("success");
          } else {
            setStatus("error");
            setErrorMessage(
              result.error || "Invalid or expired unsubscribe link",
            );
          }
        })
        .catch(() => {
          setStatus("error");
          setErrorMessage("Failed to unsubscribe. Please try manually below.");
        });
    }
  }, [initialEmail, token]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      await unsubscribeMember(email);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex flex-col items-center gap-2 justify-center gap-y-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src="/static/images/headShot.png" />
              <AvatarFallback>Shaswat Deep</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 text-lg font-bold">
              <Mail className="h-6 w-6" />
              Unsubscribe from Newsletter
            </div>
          </CardTitle>
          <CardDescription className="text-neutral-400 pt-5">
            {status === "success"
              ? "You have been unsubscribed."
              : "We're sorry to see you go."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <Alert variant="default" className="border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Successfully Unsubscribed</AlertTitle>
              <AlertDescription>
                You have been successfully unsubscribed from our newsletter. You
                won't receive any more emails from us.
              </AlertDescription>
            </Alert>
          ) : status === "error" ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              {/* Show manual form as fallback after token error */}
              <form onSubmit={handleUnsubscribe} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-neutral-700 hover:bg-neutral-600"
                  variant="default"
                >
                  Unsubscribe manually
                </Button>
              </form>
            </div>
          ) : status === "loading" ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
              <span className="ml-2 text-neutral-400">Unsubscribing...</span>
            </div>
          ) : (
            <form onSubmit={handleUnsubscribe} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-full bg-neutral-700 hover:bg-neutral-600"
                variant="default"
              >
                Unsubscribe
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
