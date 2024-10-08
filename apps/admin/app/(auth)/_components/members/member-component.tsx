"use client";

import { Settings, Search, ListFilter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
} from "date-fns";

import {
  Button,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui"; // Adjust the import path as needed

import FilterListComponent from "./filter-list-components";

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

const calculateTimeDifference = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const years = differenceInYears(now, date);
  if (years >= 1) return `${years} ${years === 1 ? "year" : "years"} ago`;

  const months = differenceInMonths(now, date);
  if (months >= 1) return `${months} ${months === 1 ? "month" : "months"} ago`;

  const days = differenceInDays(now, date);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
};

const MemberComponent = () => {
  const router = useRouter();

  // ToDo: Add backend logic to fetch all members
  const members = [
    {
      id: "1",
      name: "John Doe",
      email: "john@gmail.com",
      openRate: "N/A",
      location: "Unknown",
      created: "2024-07-24",
      image: "",
      subscribed: true,
    },
    {
      id: "2",
      name: "Sarah",
      email: "sarah@gmail.com",
      openRate: "N/A",
      location: "California, US",
      created: "2023-12-2",
      image: "",
      subscribed: true,
    },
    {
      id: "3",
      name: "",
      email: "rahul@gmail.com",
      openRate: "N/A",
      location: "India",
      created: "2021-09-01",
      image: "",
      subscribed: false,
    },
  ];

  return (
    <div className="m-8 lg:ml-[156px] lg:mr-[156px]">
      <div className="flex flex-row items-center justify-between w-full lg:w-auto mb-4 lg:mb-0">
        <Label htmlFor="members" className="text-3xl font-semibold">
          Members
        </Label>
        <div className="flex flex-row gap-3">
          <div className="max-w-0 lg:max-w-full overflow-hidden mr-8">
            <div className="flex items-center justify-end bg-neutral-900 border-2 border-neutral-950 focus-within:border-green-500 rounded-md">
              <Search className="text-neutral-400 ml-2 size-4" />
              <input
                id="SearchMembers"
                type="text"
                placeholder="Search members..."
                className="flex h-10 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-900 px-3 py-2 text-sm file:text-sm file:font-thin placeholder:text-neutral-600 placeholder:font-normal disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <div className="flex gap-2 relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="icon">
                  <ListFilter className="mr-2" /> Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="absolute -right-10 mt-2 w-[720px] lg:w-[820px] bg-neutral-800 border-none ">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none text-neutral-100">
                      Filter Lists
                    </h4>
                  </div>
                  <div className="grid gap-2">
                    <FilterListComponent />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Link href="" className="items-center">
              <Button size={"icon"} variant={"icon"}>
                <Settings />
              </Button>
            </Link>
          </div>

          <div className="flex gap-2">
            <Link href="/members/new-member" className="items-center">
              <Button variant="secondary" className="rounded-sm items-center">
                New member
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex lg:invisible overflow-hidden">
        <div className="w-2/3 "></div>
        {/* ToDo: Add search functionality */}
        <div className="flex w-1/3 items-center justify-end bg-neutral-900 border-2 border-neutral-950 focus-within:border-green-500 rounded-md">
          <Search className="text-neutral-400 ml-2 size-4" />
          <input
            id="SearchMembers"
            type="text"
            placeholder="Search members..."
            className="flex h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-900 px-3 py-2 text-sm file:text-sm file:font-thin placeholder:text-neutral-600 placeholder:font-normal disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="mt-8 lg:mt-1">
        <Table className="table-auto w-full">
          <TableHeader>
            <TableRow className="hover:bg-transparent text-neutral-200 font-light border-b-neutral-600">
              <TableHead className="text-[12px] text-neutral-100 font-light">
                {members.length} MEMBERS
              </TableHead>
              <TableHead className="text-[12px] text-neutral-100 font-light">
                OPEN RATE
              </TableHead>
              <TableHead className="text-[12px] text-neutral-100 font-light">
                LOCATION
              </TableHead>
              <TableHead className="text-[12px] text-neutral-100 font-light">
                CREATED
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow
                key={member.id}
                className="hover:bg-neutral-800 cursor-pointer font-light border-b-neutral-600"
                onClick={() => {
                  router.push(`/members/${member.id}`);
                }}
              >
                <TableCell className="flex items-center gap-3">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name || member.email.charAt(0)}
                      className="rounded-full"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500 text-white font-bold">
                      {member.name
                        ? getInitials(capitalizeWords(member.name))
                        : member.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-neutral-100">
                      {member.name
                        ? capitalizeWords(member.name)
                        : member.email}
                    </div>
                    <div className="text-neutral-400 text-sm">
                      {member.name ? member.email : ""}
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  className={
                    member.openRate === "N/A"
                      ? "text-neutral-400"
                      : "text-neutral-100"
                  }
                >
                  {member.openRate}
                </TableCell>
                <TableCell
                  className={
                    member.location === "Unknown"
                      ? "text-neutral-400"
                      : "text-neutral-100"
                  }
                >
                  {member.location}
                </TableCell>
                <TableCell className="text-neutral-100">
                  <div>
                    {new Date(member.created).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-neutral-500 text-[12px] flex justify-start">
                    ({calculateTimeDifference(member.created)})
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MemberComponent;
