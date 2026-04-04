// NewsletterButton.tsx
"use client";
import type { Member } from "@repo/actions";
import { createMember } from "@repo/actions";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface FormData {
  firstName?: string;
  lastName?: string;
  email: string;
  note?: string;
  openRate?: string;
  location?: string;
  imageUrl?: string;
  unsubscribed: boolean;
  resendContactId: string;
}

export function NewsletterButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    note: "",
    openRate: "",
    location: "",
    imageUrl: "",
    unsubscribed: false,
    resendContactId: "",
  });

  const disabled = formData.email === "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    try {
      await createMember({
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Member);
      setIsSubscribed(true);

      setIsSubscribed(false);
      setIsOpen(false);
    } catch (_err) {
      setError("Something went wrong");

      setLoading(false);
    } finally {
      setLoading(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        unsubscribed: false,
        resendContactId: "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed bottom-12 right-4  sm:right-10 z-50">
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-neutral-700/70 hover:bg-neutral-600 text-white rounded-full px-4 py-4 sm:px-6 sm:py-6 shadow-lg flex items-center gap-2"
            variant="default"
          >
            <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="">Subscribe</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-neutral-900 border-none">
          <DialogHeader className="gap-y-4">
            <DialogTitle>
              <div className="flex flex-col items-center gap-2 justify-center gap-y-4">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                  <AvatarImage src="/static/images/headShot.png" />
                  <AvatarFallback>Shaswat Deep</AvatarFallback>
                </Avatar>
                {/* <Image
                  alt='Shaswat Deep'
                  src='/static/images/headShot.png'
                  width={156}
                  height={156}
                  className='rounded-full mb-4 items-center justify-center '
                /> */}
                <span className="text-base sm:text-lg font-bold text-center">
                  Subscribe to my Newsletter
                </span>
              </div>
            </DialogTitle>
            <DialogDescription>
              {/* Stay updated with my latest blog posts and news. */}
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e: React.FormEvent) => {
              void handleSubmit(e);
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  onChange={handleChange}
                  placeholder="John"
                  value={formData.firstName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  onChange={handleChange}
                  placeholder="Doe"
                  value={formData.lastName}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email<span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="john.doe@example.com"
                required
                type="email"
                value={formData.email}
              />
            </div>
            <Button
              className="w-full bg-neutral-700 hover:bg-neutral-600"
              disabled={disabled}
              type="submit"
            >
              {(() => {
                if (loading) {
                  return (
                    <div className="flex items-center gap-2 justify-center w-full text-green-500">
                      <Loader2 className="w-4 h-4 animate-spin " />
                      <span>Subscribing...</span>
                    </div>
                  );
                }
                if (isSubscribed) {
                  return "Subscribed";
                }
                return "Subscribe";
              })()}
            </Button>
            {error ? <div className="text-red-500">{error}</div> : null}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
