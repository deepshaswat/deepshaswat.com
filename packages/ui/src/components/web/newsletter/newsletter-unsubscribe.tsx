"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, CheckCircle2, XCircle } from "lucide-react";
import { unsubscribeMember } from "@repo/actions";
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

export function NewsletterUnsubscribe() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Simulate API call
      await unsubscribeMember(email);

      // Email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.exec(email)) {
        throw new Error("Please enter a valid email address");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred",
      );
    } finally {
      setStatus("idle");
      setEmail("");
      router.push("/");
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
            We&apos;re sorry to see you go. <br /> Please enter your email to
            unsubscribe from our newsletter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            if (status === "idle" || status === "loading") {
              return (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    void handleUnsubscribe(e);
                  }}
                >
                  <Input
                    disabled={status === "loading"}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="Enter your email address"
                    required
                    type="email"
                    value={email}
                  />
                  <Button
                    className="w-full bg-neutral-700 hover:bg-neutral-600"
                    disabled={status === "loading"}
                    type="submit"
                    variant="default"
                  >
                    {status === "loading" ? (
                      <div className="flex items-center justify-center text-red-500">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin " />
                        Unsubscribing...
                      </div>
                    ) : (
                      "Unsubscribe"
                    )}
                  </Button>
                </form>
              );
            }
            if (status === "success") {
              return (
                <Alert className=" border-green-200" variant="default">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>Successfully Unsubscribed</AlertTitle>
                  <AlertDescription>
                    You have been successfully unsubscribed from our newsletter.
                    You won&apos;t receive any more emails from us.
                  </AlertDescription>
                </Alert>
              );
            }
            return (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
