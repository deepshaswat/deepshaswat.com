"use client";

import { Label, Switch, Textarea } from "@repo/ui";
import React from "react";
import { memberState } from "@repo/store";
import { useRecoilState } from "recoil";

function capitalizeWords(input: string): string {
  return input
    .split(" ") // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    .join(" "); // Join the words back into a single string
}

// Helper function to generate initials
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function getBgColorClass(
  firstName: string | undefined,
  email: string | undefined,
): string {
  if (firstName) return "bg-pink-500";
  if (email) return "bg-green-500";
  return "bg-neutral-500";
}

function getAvatarInitial(
  firstName: string | undefined,
  lastName: string | undefined,
  email: string | undefined,
): string {
  if (firstName)
    return getInitials(capitalizeWords(`${firstName} ${lastName ?? ""}`));
  if (email) return email.charAt(0).toUpperCase();
  return "N";
}

export default function EditMemberComponent(): JSX.Element | null {
  const [memberData, setMemberData] = useRecoilState(memberState);

  // Return early if memberData is not yet initialized
  if (!memberData) return null;

  const bgColorClass = getBgColorClass(memberData.firstName, memberData.email);

  const handleMemberFirstNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setMemberData({ ...memberData, firstName: e.target.value });
  };

  const handleMemberLastNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setMemberData({ ...memberData, lastName: e.target.value });
  };

  const handleMemberEmailChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setMemberData({ ...memberData, email: e.target.value });
  };

  const handleMemberDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setMemberData({ ...memberData, note: e.target.value });
  };

  const handleNewsletterSubscriptionChange = (): void => {
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
            {getAvatarInitial(
              memberData.firstName,
              memberData.lastName,
              memberData.email,
            )}
          </div>
          <span className="text-neutral-400">
            {`${memberData.firstName} ${memberData.lastName}`}
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
                  className="text-sm text-neutral-200"
                  htmlFor="MemberFirstName"
                >
                  First Name
                </Label>
                <div className="bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md">
                  <input
                    className="h-10 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    id="MemberFirstName"
                    onChange={handleMemberFirstNameChange}
                    type="text"
                    value={memberData.firstName}
                  />
                </div>
              </div>
              <div className="space-y-2 w-full">
                <Label
                  className="text-sm text-neutral-200"
                  htmlFor="MemberLastName"
                >
                  Last Name
                </Label>
                <div className="bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md">
                  <input
                    className="h-10 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    id="MemberLastName"
                    onChange={handleMemberLastNameChange}
                    type="text"
                    value={memberData.lastName}
                  />
                </div>
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-2">
              <Label className="text-sm text-neutral-200" htmlFor="MemberEmail">
                Email
              </Label>
              <div className="bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md">
                <input
                  className="h-10 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  id="MemberEmail"
                  onChange={handleMemberEmailChange}
                  type="email"
                  value={memberData.email}
                />
              </div>
            </div>
          </div>

          {/* Description input */}
          <div className="mt-6 space-y-2">
            <Label
              className="text-sm text-neutral-200"
              htmlFor="MemberDescription"
            >
              Note (not visible to member)
            </Label>
            <Textarea
              className="mt-2 h-28 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-2 border-transparent focus-within:border-green-500"
              id="MemberDescription"
              maxLength={500}
              onChange={handleMemberDescriptionChange}
              value={memberData.note}
            />
            <div className="text-neutral-500 text-[12px]">
              Maximum: 500 characters. You&apos;ve used{" "}
              <span
                className={
                  memberData.note?.length === 0 ? "" : "text-green-500"
                }
              >
                {memberData.note?.length}
              </span>
              .
            </div>
          </div>
        </div>

        {/* Newsletter section */}
        <div className="bg-neutral-900 p-6 rounded-lg">
          <Label
            className="text-sm text-neutral-200"
            htmlFor="newsletter-subscription"
          >
            NEWSLETTERS
          </Label>
          <div className="bg-neutral-800 p-4 rounded-lg flex justify-between items-center mt-4">
            <Label
              className="text-neutral-200"
              htmlFor="newsletter-subscription"
            >
              Shaswat Deep
            </Label>
            <Switch
              checked={!memberData.unsubscribed}
              className="data-[state=checked]:bg-green-500"
              id="newsletter-subscription"
              onCheckedChange={handleNewsletterSubscriptionChange}
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
