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

import { createMember, Member, MemberInput } from "@repo/actions";
import { useRouter } from "next/dist/client/components/navigation";

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

  const bgColorClass = member.firstName
    ? "bg-pink-500"
    : member.email
      ? "bg-green-500"
      : "bg-neutral-500";

  const handleMemberFirstNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMember({ ...member, firstName: e.target.value });
  };

  const handleMemberLastNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMember({ ...member, lastName: e.target.value });
  };

  const handleMemberEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMember({ ...member, email: e.target.value });
  };

  const handleMemberDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMember({ ...member, note: e.target.value });
  };

  const handleNewsletterSubscriptionChange = () => {
    setMember({ ...member, unsubscribed: !member?.unsubscribed });
  };

  const handleSave = async () => {
    try {
      await createMember(member as Member);
      router.push("/members");
    } catch (error) {
      console.error("Error creating member:", error);
    }
  };

  return (
    <div className='m-8 lg:mx-[156px]'>
      <div className='flex flex-row justify-between items-center'>
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

        <Button
          variant='default'
          className='rounded-sm'
          onClick={handleSave}
          disabled={isDisabled}
        >
          Save
        </Button>
      </div>

      <div className='flex flex-row justify-between items-center'>
        <Label htmlFor='' className='text-3xl font-semibold'>
          New member
        </Label>
      </div>

      <div className='flex mt-10 gap-8 lg:ml-16 flex-col md:flex-row '>
        {/* Avatar and name */}
        <div className='lg:mr-16'>
          <div className='flex flex-row items-center gap-4 justify-center lg:justify-start'>
            <div
              className={`flex items-center justify-center w-20 h-20 rounded-full text-white text-4xl ${bgColorClass}`}
            >
              {member?.firstName
                ? getInitials(capitalizeWords(member?.firstName))
                : member?.email
                  ? member?.email.charAt(0).toUpperCase()
                  : "N"}
            </div>
            <span className='text-neutral-400'>
              {isEmpty
                ? "New member"
                : member?.firstName + " " + member?.lastName}
            </span>
          </div>
        </div>

        {/* Form section */}
        <div className='flex flex-col flex-grow gap-6 lg:max-w-screen-md'>
          <div className='bg-neutral-900 p-6 rounded-lg'>
            <div className='space-y-6'>
              {/* Name input */}
              <div className='flex flex-row gap-4'>
                <div className='space-y-2 w-full'>
                  <Label
                    htmlFor='MemberFirstName'
                    className='text-sm text-neutral-200'
                  >
                    First Name
                  </Label>
                  <div className='bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md'>
                    <input
                      id='MemberFirstName'
                      type='text'
                      value={member?.firstName}
                      onChange={handleMemberFirstNameChange}
                      className='h-10 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
                    />
                  </div>
                </div>
                <div className='space-y-2 w-full'>
                  <Label
                    htmlFor='MemberLastName'
                    className='text-sm text-neutral-200'
                  >
                    Last Name
                  </Label>
                  <div className='bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md'>
                    <input
                      id='MemberLastName'
                      type='text'
                      value={member?.lastName}
                      onChange={handleMemberLastNameChange}
                      className='h-10 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
                    />
                  </div>
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
                    value={member?.email}
                    onChange={handleMemberEmailChange}
                    className='h-10 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
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
                value={member?.note}
                onChange={handleMemberDescriptionChange}
                maxLength={500}
                className='mt-2 h-28 w-full rounded-md text-neutral-300 bg-neutral-800 px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-2 border-transparent focus-within:border-green-500'
              />
              <div className='text-neutral-500 text-[12px]'>
                Maximum: 500 characters. You've used{" "}
                <span
                  className={member?.note.length === 0 ? "" : "text-green-500"}
                >
                  {member?.note.length}
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
                checked={member?.unsubscribed ? false : true}
                onCheckedChange={handleNewsletterSubscriptionChange}
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
