"use client";

import { Settings, Search, ListFilter, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRecoilState, useResetRecoilState } from "recoil";

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
  PaginationBar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui";

import { pageNumberState, totalMembersState } from "@repo/store";

import FilterListComponent from "./filter-list-components";
import { useEffect, useState } from "react";
import { fetchMembers, Member, totalMembers } from "@repo/actions";
import ImportMembersComponent from "./import-members-components";

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

const calculateTimeDifference = (date: Date) => {
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
  const [currentPage, setCurrentPage] = useRecoilState(pageNumberState);
  const [totalMembersCount, setTotalMembersCount] =
    useRecoilState(totalMembersState);
  const resetPageNumber = useResetRecoilState(pageNumberState);
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);

  useEffect(() => {
    resetPageNumber();
  }, [resetPageNumber]);

  // ToDo: Add backend logic to fetch all members
  const fetchMembersList = async () => {
    const members = await fetchMembers({
      pageNumber: currentPage,
      pageSize: 30,
      search: search,
    });
    setMembersList(members);
    setLoading(false);
  };

  useEffect(() => {
    const getTotalMembers = async () => {
      const total = await totalMembers();
      if (total > 0) {
        setTotalMembersCount(total);
      }
    };
    getTotalMembers();
  }, []);

  useEffect(() => {
    fetchMembersList();
  }, [currentPage, search]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExportMembers = async () => {
    // TODO: Implement export functionality
    console.log("Export members");
  };

  return (
    <div className='m-8 lg:ml-[156px] lg:mr-[156px]'>
      <div className='flex flex-row items-center justify-between w-full lg:w-auto mb-4 lg:mb-0'>
        <Label htmlFor='members' className='text-3xl font-semibold'>
          Members
        </Label>
        <div className='flex flex-row gap-3'>
          <div className='max-w-0 lg:max-w-full overflow-hidden mr-8'>
            <div className='flex items-center justify-end bg-neutral-900 border-2 border-neutral-950 focus-within:border-green-500 rounded-md'>
              <Search className='text-neutral-400 ml-2 size-4' />
              <input
                id='SearchMembers'
                type='text'
                placeholder='Search members...'
                className='flex h-10  w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-900 px-3 py-2 text-sm file:text-sm file:font-thin placeholder:text-neutral-600 placeholder:font-normal disabled:cursor-not-allowed disabled:opacity-50'
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>
          <div className='flex gap-2 relative'>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='icon'>
                  <ListFilter className='mr-2' /> Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className='absolute -right-10 mt-2 w-[720px] lg:w-[820px] bg-neutral-800 border-none'>
                <div className='grid gap-4'>
                  <div className='space-y-2'>
                    <h4 className='font-medium leading-none text-neutral-100'>
                      Filter Lists
                    </h4>
                  </div>
                  <div className='grid gap-2'>
                    <FilterListComponent />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={"icon"} variant={"icon"}>
                  <Settings />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className=' bg-neutral-800 border-none text-neutral-100'
              >
                <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Import members
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className='bg-neutral-900 border-neutral-800 w-[600px] max-w-[90vw]'>
                    <DialogHeader className='mb-6'>
                      <DialogTitle className='text-xl text-white'>
                        Import Members
                      </DialogTitle>
                      <DialogDescription className='text-neutral-400 mt-1'>
                        Upload a CSV file with member data. The file should
                        include email, first_name, last_name, and subscribed_to
                        columns.
                      </DialogDescription>
                    </DialogHeader>
                    <ImportMembersComponent
                      onClose={() => setIsImportOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
                <DropdownMenuItem onSelect={handleExportMembers}>
                  Export all members
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className='flex gap-2'>
            <Link href='/members/new-member' className='items-center'>
              <Button variant='secondary' className='rounded-sm items-center'>
                New member
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className='flex lg:invisible overflow-hidden'>
        <div className='w-2/3 '></div>
        {/* ToDo: Add search functionality */}
        <div className='flex w-1/3 items-center justify-end bg-neutral-900 border-2 border-neutral-950 focus-within:border-green-500 rounded-md'>
          <Search className='text-neutral-400 ml-2 size-4' />
          <input
            id='SearchMembers'
            type='text'
            placeholder='Search members...'
            className='flex h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-900 px-3 py-2 text-sm file:text-sm file:font-thin placeholder:text-neutral-600 placeholder:font-normal disabled:cursor-not-allowed disabled:opacity-50'
          />
        </div>
      </div>

      {loading ? (
        <div className='flex flex-row items-center justify-center h-screen-1/2'>
          <Loader2 className='size-10 animate-spin' />
        </div>
      ) : (
        <div className='mt-8 lg:mt-1'>
          <Table className='table-auto w-full'>
            <TableHeader>
              <TableRow className='hover:bg-transparent text-neutral-200 font-light border-b-neutral-600'>
                <TableHead className='text-[12px] text-neutral-100 font-light'>
                  {totalMembersCount} MEMBERS
                </TableHead>
                <TableHead className='text-[12px] text-neutral-100 font-light'>
                  OPEN RATE
                </TableHead>
                <TableHead className='text-[12px] text-neutral-100 font-light'>
                  LOCATION
                </TableHead>
                <TableHead className='text-[12px] text-neutral-100 font-light'>
                  CREATED
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membersList.map((member) => (
                <TableRow
                  key={member.id}
                  className='hover:bg-neutral-800 cursor-pointer font-light border-b-neutral-600'
                  onClick={() => {
                    router.push(`/members/${member.id}`);
                  }}
                >
                  <TableCell className='flex items-center gap-3'>
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={
                          member.firstName ||
                          member.lastName ||
                          member.email.charAt(0)
                        }
                        className='rounded-full'
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className='flex items-center justify-center w-10 h-10 rounded-full bg-pink-500 text-white font-bold'>
                        {member.firstName
                          ? getInitials(
                              capitalizeWords(
                                member.firstName + " " + member.lastName
                              )
                            )
                          : member.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className='font-medium text-neutral-100'>
                        {member.firstName
                          ? capitalizeWords(
                              member.firstName + " " + member.lastName
                            )
                          : member.email}
                      </div>
                      <div className='text-neutral-400 text-sm'>
                        {member.firstName && member.lastName
                          ? member.email
                          : ""}
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
                  <TableCell className='text-neutral-100'>
                    <div>
                      {new Date(member.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className='text-neutral-500 text-[12px] flex justify-start'>
                      ({calculateTimeDifference(member.createdAt)})
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {loading ? (
        <> </>
      ) : membersList.length > 0 ? (
        <PaginationBar
          currentPage={currentPage}
          totalPages={Math.ceil(totalMembersCount / 30)}
          onPageChange={handlePageChange}
        />
      ) : (
        <div className='flex flex-row mt-10 items-start justify-center h-screen-1/2'>
          <p className='text-3xl text-red-700'>No members found</p>
        </div>
      )}
    </div>
  );
};

export default MemberComponent;
