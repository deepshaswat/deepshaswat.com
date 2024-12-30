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
import { fetchMemberDetails, updateMember } from "@repo/actions";

import EditMemberComponent from "../../_components/members/edit-member-component";
import { memberState } from "@repo/store";

export default function ({ params }: { params: { id: string } }) {
  const { id } = params;
  const [member, setMember] = useRecoilState(memberState);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="m-8  lg:ml-[156px] lg:mr-[156px]">
      <div className="">
        <div className="flex flex-row items-center justify-between mb-4 lg:mb-0 ">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/members"
                    className="text-neutral-200 hover:text-neutral-100"
                  >
                    Members
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-normal text-neutral-500">
                    Edit member
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className=" gap-20 justify-start">
            <Button
              variant="secondary"
              className="rounded-sm items-center"
              onClick={handleSave}
            >
              {isLoading ? (
                <div className="flex items-center gap-2 text-green-500">
                  <Loader2 className="w-4 h-4 animate-spin text-green-500" />{" "}
                  Saving
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </div>
      <EditMemberComponent />
    </div>
  );
}
