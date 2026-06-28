"use client";

import { useEffect, useState, useTransition } from "react";
import Head from "next/head";
import { useRecoilState } from "recoil";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { showToastEmailState } from "@repo/store";
import { ContactSchema } from "@repo/schema";
import { contact } from "@repo/actions";
import { Base } from "../posts/base-static";
import { FormError } from "../error-page/form-error";
import {
  FormProvider as Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Textarea } from "../../ui/textarea";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "../../ui/card";

export function Contact() {
  const meta = {
    title: "Contact // Shaswat Deep",
    description: "",
    tagline: "Email me. Like in the old days.",
    image: "https://www.deepshaswat.com/static/images/reminder-bw.jpg",
    primaryColor: "cyan",
    secondaryColor: "green",
  };
  const { title, description, image, tagline, primaryColor, secondaryColor } =
    meta;

  const [showToast, setShowToast] = useRecoilState(showToastEmailState);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      email: "",
      name: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ContactSchema>) => {
    setError("");

    startTransition(() => {
      void contact(values).then((response) => {
        if (response.error) {
          setError(response.error);
        } else if (response.success) {
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 3000);
          form.reset();
        }
      });
    });
  };

  useEffect(() => {
    const displayToast = () => {
      <div className="fixed bottom-15 right-5">
        {toast("Email Sent!", {
          action: {
            label: "Close",
            onClick: () => {
              setShowToast(false);
            },
          },
        })}
      </div>;
    };

    if (showToast) {
      displayToast();
      setShowToast(false);
    }
  }, [showToast, setShowToast]);

  const renderForm = () => {
    return (
      <Card className="flex flex-col h-full  w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl justify-center items-center">
            Let&apos;s Talk
          </CardTitle>
        </CardHeader>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              void form.handleSubmit(onSubmit)(e);
            }}
          >
            <div className="space-y-0 px-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-500">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="John Doe"
                      />
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
                    <FormLabel className="text-neutral-500">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-500">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[100px] "
                        disabled={isPending}
                        id="message"
                        placeholder="Enter your message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mx-auto pl-4 pr-4">
              <FormError message={error} />
            </div>

            <CardFooter>
              <Button
                className="w-full"
                disabled={isPending}
                type="submit"
                variant="outline"
              >
                Send
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={description} name="description" />
        <meta content={description} property="og:description" />
        <meta
          content="https://www.deepshaswat.com/reminder"
          property="og:url"
        />
        <meta content={image} property="og:image" />
      </Head>

      <Base
        description=""
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        tagline={tagline}
        title={title}
      >
        {renderForm()}
      </Base>
    </>
  );
}
