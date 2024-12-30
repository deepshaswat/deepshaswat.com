"use client";

import { useState } from "react";
import { Button, Label, SingleImageDropzone, Switch, Textarea } from "@repo/ui";
import React from "react";
import { Member } from "@repo/actions";
import { memberState } from "@repo/store";
import { useRecoilState } from "recoil";

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

export default function EditMemberComponent() {
  const [memberData, setMemberData] = useRecoilState(memberState);

  // Return early if memberData is not yet initialized
  if (!memberData) return null;

  const bgColorClass = memberData.firstName
    ? "bg-pink-500"
    : memberData.email
      ? "bg-green-500"
      : "bg-neutral-500";

  const handleMemberFirstNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setMemberData({ ...memberData, firstName: e.target.value });
  };

  const handleMemberLastNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setMemberData({ ...memberData, lastName: e.target.value });
  };

  const handleMemberEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberData({ ...memberData, email: e.target.value });
  };

  const handleMemberDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMemberData({ ...memberData, note: e.target.value });
  };

  const handleNewsletterSubscriptionChange = () => {
    setMemberData({ ...memberData, unsubscribed: !memberData.unsubscribed });
  };

  return (
    <div className="flex mt-10 gap-8 lg:ml-16 flex-col md:flex-row">
      {/* Avatar and name */}
      <div className="lg:mr-16">
        <div className="flex flex-row items-center gap-4 justify-center lg:justify-start">
          <div
            className={`flex items-center justify-center w-20 h-20 rounded-full text-white text-4xl ${bgColorClass}`}
          >
            {memberData.firstName
              ? getInitials(
                  capitalizeWords(
                    memberData.firstName + " " + memberData.lastName,
                  ),
                )
              : memberData.email
                ? memberData.email.charAt(0).toUpperCase()
                : "N"}
          </div>
          <span className="text-neutral-400">
            {memberData.firstName + " " + memberData.lastName}
          </span>
        </div>
      </div>

      {/* Form section */}
      <div className="flex flex-col flex-grow gap-6 lg:max-w-screen-md">
        <div className="bg-neutral-900 p-6 rounded-lg">
          <div className="space-y-6">
            {/* Name input */}
            <div className="flex flex-row gap-4">
              <div className="space-y-2 w-full">
                <Label
                  htmlFor="MemberFirstName"
                  className="text-sm text-neutral-200"
                >
                  First Name
                </Label>
                <div className="bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md">
                  <input
                    id="MemberFirstName"
                    type="text"
                    value={memberData.firstName}
                    onChange={handleMemberFirstNameChange}
                    className="h-10 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="space-y-2 w-full">
                <Label
                  htmlFor="MemberLastName"
                  className="text-sm text-neutral-200"
                >
                  Last Name
                </Label>
                <div className="bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md">
                  <input
                    id="MemberLastName"
                    type="text"
                    value={memberData.lastName}
                    onChange={handleMemberLastNameChange}
                    className="h-10 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-2">
              <Label htmlFor="MemberEmail" className="text-sm text-neutral-200">
                Email
              </Label>
              <div className="bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md">
                <input
                  id="MemberEmail"
                  type="email"
                  value={memberData.email}
                  onChange={handleMemberEmailChange}
                  className="h-10 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Description input */}
          <div className="mt-6 space-y-2">
            <Label
              htmlFor="MemberDescription"
              className="text-sm text-neutral-200"
            >
              Note (not visible to member)
            </Label>
            <Textarea
              id="MemberDescription"
              value={memberData.note}
              onChange={handleMemberDescriptionChange}
              maxLength={500}
              className="mt-2 h-28 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-2 border-transparent focus-within:border-green-500"
            />
            <div className="text-neutral-500 text-[12px]">
              Maximum: 500 characters. You've used{" "}
              <span
                className={memberData.note.length === 0 ? "" : "text-green-500"}
              >
                {memberData.note.length}
              </span>
              .
            </div>
          </div>
        </div>

        {/* Newsletter section */}
        <div className="bg-neutral-900 p-6 rounded-lg">
          <Label
            htmlFor="newsletter-subscription"
            className="text-sm text-neutral-200"
          >
            NEWSLETTERS
          </Label>
          <div className="bg-neutral-800 p-4 rounded-lg flex justify-between items-center mt-4">
            <Label
              htmlFor="newsletter-subscription"
              className="text-neutral-200"
            >
              Shaswat Deep
            </Label>
            <Switch
              id="newsletter-subscription"
              checked={memberData.unsubscribed ? false : true}
              onCheckedChange={handleNewsletterSubscriptionChange}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          <div className="mt-2 text-sm text-neutral-600">
            If disabled, member will not receive newsletter emails.
          </div>
        </div>
      </div>
    </div>
  );
}
