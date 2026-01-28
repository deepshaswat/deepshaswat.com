"use client";

import { deleteMember, fetchMemberDetails, updateMember } from "@repo/actions";
import { memberState } from "@repo/store";
import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import EditMemberComponent from "../../_components/members/edit-member-component";

export default function MemberEditPage({
  params,
}: {
  params: { id: string };
}): JSX.Element {
  const router = useRouter();
  const { id } = params;
  const [member, setMember] = useRecoilState(memberState);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadMember = async (): Promise<void> => {
      try {
        const fetchedMember = await fetchMemberDetails(id);
        if (fetchedMember === null) {
          router.replace("/members");
          return;
        }
        setMember(fetchedMember);
      } catch {
        router.replace("/members");
      } finally {
        setPageLoading(false);
      }
    };
    void loadMember();
  }, [id, setMember, router]);

  const handleSave = async (): Promise<void> => {
    if (!member) return;
    setIsLoading(true);
    await updateMember(id, member);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleDelete = async (): Promise<void> => {
    if (!member) return;
    setIsLoadingDelete(true);
    await deleteMember(id);
    setTimeout(() => {
      setIsLoadingDelete(false);
      router.push("/members");
    }, 1000);
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="m-8  lg:ml-[156px] lg:mr-[156px]">
      <div className="">
        <div className="flex flex-row items-center justify-between mb-4 lg:mb-0 ">
          <div>
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
                    Edit member
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="gap-20 justify-start">
            <div className="flex flex-row gap-4">
              <Button
                className="rounded-sm items-center"
                onClick={() => {
                  void handleSave();
                }}
                variant="default"
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
              <Button
                className="rounded-sm items-center"
                onClick={() => {
                  void handleDelete();
                }}
                variant="destructive"
              >
                {isLoadingDelete ? (
                  <div className="flex items-center gap-2 text-red-500">
                    <Loader2 className="w-4 h-4 animate-spin text-red-500" />{" "}
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
