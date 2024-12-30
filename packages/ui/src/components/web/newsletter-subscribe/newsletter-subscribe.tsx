// NewsletterButton.tsx
"use client";
import { createMember, Member } from "@repo/actions";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Input,
  Label,
} from "@repo/ui";

import { Loader2, Mail } from "lucide-react";
import { useState } from "react";

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

export const NewsletterButton = () => {
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
      // Add your submission logic here
      console.log("Form submitted:", formData);
      const member = await createMember({
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Member);
      console.log("Member created:", member);
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      setError("Something went wrong");
      setTimeout(() => {
        setLoading(false);
      }, 3000);
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
    <div className='fixed bottom-10 right-10 z-50'>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant='default'
            className='bg-neutral-700 hover:bg-neutral-600 text-white rounded-full px-6 py-6 shadow-lg flex items-center gap-2'
          >
            <Mail className='h-5 w-5' />
            <span>Subscribe</span>
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md bg-neutral-900'>
          <DialogHeader className='gap-y-4'>
            <DialogTitle>
              <div className='flex flex-col items-center gap-2 justify-center gap-y-4'>
                <Avatar className='w-32 h-32'>
                  <AvatarImage src='/static/images/headshot.svg' />
                  <AvatarFallback>Shaswat Deep</AvatarFallback>
                </Avatar>
                <span className='text-lg font-bold'>
                  Subscribe to my Newsletter
                </span>
              </div>
            </DialogTitle>
            <DialogDescription>
              {/* Stay updated with my latest blog posts and news. */}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder='John'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder='Doe'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>
                Email<span className='text-red-500'>*</span>
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='john.doe@example.com'
                required
              />
            </div>
            <Button
              type='submit'
              className='w-full bg-neutral-700 hover:bg-neutral-600'
              disabled={disabled}
            >
              {loading ? (
                <div className='flex items-center gap-2 justify-center w-full text-green-500'>
                  <Loader2 className='w-4 h-4 animate-spin ' />
                  <span>Subscribing...</span>
                </div>
              ) : isSubscribed ? (
                "Subscribed"
              ) : (
                "Subscribe"
              )}
            </Button>
            {error && <div className='text-red-500'>{error}</div>}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
