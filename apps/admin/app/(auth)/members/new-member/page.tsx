"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Button,
  Label,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Textarea,
  Switch,
} from "@repo/ui";
import React from "react";

const capitalizeWords = (input: string) => {
  return input
    .split(" ") // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    .join(" "); // Join the words back into a single string
};

// Helper function to generate initials
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const NewMember = () => {
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberDescription, setMemberDescription] = useState("");
  const [newsletterSubscription, setNewsletterSubscription] = useState(false);
  const isEmpty = memberName === "";

  const bgColorClass = memberName
    ? "bg-pink-500"
    : memberEmail
      ? "bg-green-500"
      : "bg-neutral-500";

  const handleMemberNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberName(e.target.value);
  };

  const handleMemberEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberEmail(e.target.value);
  };

  const handleMemberDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMemberDescription(e.target.value);
  };

  return (
    <div className='m-8 lg:ml-[156px] lg:mr-[156px]'>
      <div
        className='flex justify-between items-center mb-
      '
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href='/members'
                className='text-neutral-200 hover:text-neutral-100'
              >
                Members
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='font-normal text-neutral-500'>
                New member
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant='secondary' className='rounded-sm'>
          Save
        </Button>
      </div>

      <Label htmlFor='' className='text-3xl font-semibold'>
        New member
      </Label>

      <div className='flex md:flex-col flex-row lg:flex-row mt-10 gap-8 lg:ml-16 '>
        {/* Avatar and name */}
        <div className='mr-16'>
          <div className='flex flex-row items-center gap-4 justify-start'>
            <div
              className={`flex items-center justify-center w-20 h-20 rounded-full text-white text-4xl ${bgColorClass}`}
            >
              {memberName
                ? getInitials(capitalizeWords(memberName))
                : memberEmail
                  ? memberEmail.charAt(0).toUpperCase()
                  : "N"}
            </div>
            <span className='text-neutral-400'>
              {isEmpty ? "New member" : memberName}
            </span>
          </div>
        </div>

        {/* Form section */}
        <div className='flex flex-col flex-grow gap-6 lg:max-w-screen-md'>
          <div className='bg-neutral-900 p-6 rounded-lg'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Name input */}
              <div className='space-y-2'>
                <Label
                  htmlFor='MemberName'
                  className='text-sm text-neutral-200'
                >
                  Name
                </Label>
                <div className='bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md'>
                  <input
                    id='MemberName'
                    type='text'
                    value={memberName}
                    onChange={handleMemberNameChange}
                    className='h-10 pl-3 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
                  />
                </div>
              </div>

              {/* Email input */}
              <div className='space-y-2'>
                <Label
                  htmlFor='MemberEmail'
                  className='text-sm text-neutral-200'
                >
                  Email
                </Label>
                <div className='bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md'>
                  <input
                    id='MemberEmail'
                    type='email'
                    value={memberEmail}
                    onChange={handleMemberEmailChange}
                    className='h-10 pl-3 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
                  />
                </div>
              </div>
            </div>

            {/* Description input */}
            <div className='mt-6 space-y-2'>
              <Label
                htmlFor='MemberDescription'
                className='text-sm text-neutral-200'
              >
                Note (not visible to member)
              </Label>
              <Textarea
                id='MemberDescription'
                value={memberDescription}
                onChange={handleMemberDescriptionChange}
                maxLength={500}
                className='mt-2 h-28 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-2 border-transparent focus-within:border-green-500'
              />
              <div className='text-neutral-500 text-[12px]'>
                Maximum: 500 characters. You've used{" "}
                <span
                  className={
                    memberDescription.length === 0 ? "" : "text-green-500"
                  }
                >
                  {memberDescription.length}
                </span>
                .
              </div>
            </div>
          </div>

          {/* Newsletter section */}
          <div className='bg-neutral-900 p-6 rounded-lg'>
            <Label
              htmlFor='newsletter-subscription'
              className='text-sm text-neutral-200'
            >
              NEWSLETTERS
            </Label>
            <div className='bg-neutral-800 p-4 rounded-lg flex justify-between items-center mt-4'>
              <Label
                htmlFor='newsletter-subscription'
                className='text-neutral-200'
              >
                Shaswat Deep
              </Label>
              <Switch
                id='newsletter-subscription'
                checked={newsletterSubscription}
                onCheckedChange={setNewsletterSubscription}
                className='data-[state=checked]:bg-green-500'
              />
            </div>
            <div className='mt-2 text-sm text-neutral-600'>
              If disabled, member will not receive newsletter emails.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMember;