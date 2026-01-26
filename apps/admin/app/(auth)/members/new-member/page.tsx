"use client";

import type { Member, MemberInput } from "@repo/actions";
import { createMember } from "@repo/actions";
import { useRouter } from "next/dist/client/components/navigation";
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

function getBgColorClass(firstName: string, email: string): string {
  if (firstName) return "bg-pink-500";
  if (email) return "bg-green-500";
  return "bg-neutral-500";
}

function getAvatarInitial(
  firstName: string | undefined,
  email: string | undefined,
): string {
  if (firstName) return getInitials(capitalizeWords(firstName));
  if (email) return email.charAt(0).toUpperCase();
  return "N";
}

function NewMember(): JSX.Element {
  const router = useRouter();

  const [member, setMember] = useState<MemberInput>({
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

  const isEmpty = member.firstName === "" && member.lastName === "";

  const isDisabled = member.email === "";

  const bgColorClass = getBgColorClass(member.firstName, member.email);

  const handleMemberFirstNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setMember({ ...member, firstName: e.target.value });
  };

  const handleMemberLastNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setMember({ ...member, lastName: e.target.value });
  };

  const handleMemberEmailChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setMember({ ...member, email: e.target.value });
  };

  const handleMemberDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setMember({ ...member, note: e.target.value });
  };

  const handleNewsletterSubscriptionChange = (): void => {
    setMember({ ...member, unsubscribed: !member.unsubscribed });
  };

  const handleSave = async (): Promise<void> => {
    try {
      await createMember(member as Member);
      router.push("/members");
    } catch (error) {
      // eslint-disable-next-line no-console -- Error logging for debugging member creation failures
      console.error("Error creating member:", error);
    }
  };

  return (
    <div className="m-8 lg:mx-[156px]">
      <div className="flex flex-row justify-between items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-neutral-200 hover:text-neutral-100"
                href="/members"
              >
                Members
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-normal text-neutral-500">
                New member
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button
          className="rounded-sm"
          disabled={isDisabled}
          onClick={() => {
            void handleSave();
          }}
          variant="default"
        >
          Save
        </Button>
      </div>

      <div className="flex flex-row justify-between items-center">
        <Label className="text-3xl font-semibold" htmlFor="">
          New member
        </Label>
      </div>

      <div className="flex mt-10 gap-8 lg:ml-16 flex-col md:flex-row ">
        {/* Avatar and name */}
        <div className="lg:mr-16">
          <div className="flex flex-row items-center gap-4 justify-center lg:justify-start">
            <div
              className={`flex items-center justify-center w-20 h-20 rounded-full text-white text-4xl ${bgColorClass}`}
            >
              {getAvatarInitial(member.firstName, member.email)}
            </div>
            <span className="text-neutral-400">
              {isEmpty
                ? "New member"
                : `${member.firstName} ${member.lastName}`}
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
                      value={member.firstName}
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
                      value={member.lastName}
                    />
                  </div>
                </div>
              </div>

              {/* Email input */}
              <div className="space-y-2">
                <Label
                  className="text-sm text-neutral-200"
                  htmlFor="MemberEmail"
                >
                  Email
                </Label>
                <div className="bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md">
                  <input
                    className="h-10 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    id="MemberEmail"
                    onChange={handleMemberEmailChange}
                    type="email"
                    value={member.email}
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
                value={member.note}
              />
              <div className="text-neutral-500 text-[12px]">
                Maximum: 500 characters. You&apos;ve used{" "}
                <span
                  className={member.note.length === 0 ? "" : "text-green-500"}
                >
                  {member.note.length}
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
                checked={!member.unsubscribed}
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
    </div>
  );
}

export default NewMember;
