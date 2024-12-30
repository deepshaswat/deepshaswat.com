"use client";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Loader2 } from "lucide-react";
import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui";
import { deleteMember, fetchMemberDetails, updateMember } from "@repo/actions";

import EditMemberComponent from "../../_components/members/edit-member-component";
import { memberState } from "@repo/store";
import { useRouter } from "next/navigation";

export default function ({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [member, setMember] = useRecoilState(memberState);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const memberFetch = async () => {
    const member = await fetchMemberDetails(id);
    setMember(member);
  };

  useEffect(() => {
    memberFetch();
  }, [setMember]);

  const handleSave = async () => {
    if (!member) return;
    setIsLoading(true);
    await updateMember(id, member);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleDelete = async () => {
    if (!member) return;
    setIsLoadingDelete(true);
    await deleteMember(id);
    setTimeout(() => {
      setIsLoadingDelete(false);
      router.push("/members");
    }, 1000);
  };

  return (
    <div className='m-8  lg:ml-[156px] lg:mr-[156px]'>
      <div className=''>
        <div className='flex flex-row items-center justify-between mb-4 lg:mb-0 '>
          <div>
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
                    Edit member
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className='gap-20 justify-start'>
            <div className='flex flex-row gap-4'>
              <Button
                variant='default'
                className='rounded-sm items-center'
                onClick={handleSave}
              >
                {isLoading ? (
                  <div className='flex items-center gap-2 text-green-500'>
                    <Loader2 className='w-4 h-4 animate-spin text-green-500' />{" "}
                    Saving
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                variant='destructive'
                className='rounded-sm items-center'
                onClick={handleDelete}
              >
                {isLoadingDelete ? (
                  <div className='flex items-center gap-2 text-red-500'>
                    <Loader2 className='w-4 h-4 animate-spin text-red-500' />{" "}
                    Deleting
                  </div>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <EditMemberComponent />
    </div>
  );
}
