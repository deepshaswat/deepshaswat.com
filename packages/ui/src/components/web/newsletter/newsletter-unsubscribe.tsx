"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@repo/ui";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui";
import { Loader2, Mail, CheckCircle2, XCircle } from "lucide-react";
import { unsubscribeMember } from "@repo/actions";

export const NewsletterUnsubscribe = () => {
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
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error("Please enter a valid email address");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setStatus("idle");
      setEmail("");
      router.push("/");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='flex flex-col items-center gap-2 justify-center gap-y-6'>
            <Avatar className='w-32 h-32'>
              <AvatarImage src='/static/images/headShot.png' />
              <AvatarFallback>Shaswat Deep</AvatarFallback>
            </Avatar>
            <div className='flex items-center gap-2 text-lg font-bold'>
              <Mail className='h-6 w-6' />
              Unsubscribe from Newsletter
            </div>
          </CardTitle>
          <CardDescription className='text-neutral-400 pt-5'>
            We're sorry to see you go. <br /> Please enter your email to
            unsubscribe from our newsletter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "idle" || status === "loading" ? (
            <form onSubmit={handleUnsubscribe} className='space-y-4'>
              <Input
                type='email'
                placeholder='Enter your email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                required
              />
              <Button
                type='submit'
                className='w-full bg-neutral-700 hover:bg-neutral-600'
                disabled={status === "loading"}
                variant='default'
              >
                {status === "loading" ? (
                  <div className='flex items-center justify-center text-red-500'>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin ' />
                    Unsubscribing...
                  </div>
                ) : (
                  "Unsubscribe"
                )}
              </Button>
            </form>
          ) : status === "success" ? (
            <Alert variant='default' className=' border-green-200'>
              <CheckCircle2 className='h-4 w-4 text-green-600' />
              <AlertTitle>Successfully Unsubscribed</AlertTitle>
              <AlertDescription>
                You have been successfully unsubscribed from our newsletter. You
                won't receive any more emails from us.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant='destructive'>
              <XCircle className='h-4 w-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
