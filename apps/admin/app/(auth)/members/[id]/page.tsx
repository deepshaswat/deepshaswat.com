import { notFound } from "next/navigation";
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
  SingleImageDropzone,
  Textarea,
} from "@repo/ui";
import { fetchMemberDetails } from "@repo/actions";
import React from "react";
import EditMemberComponent from "../../_components/members/edit-member-component";

export default async function ({ params }: { params: { id: string } }) {
  const { id } = params;

  const member = await fetchMemberDetails(id);

  //Handle case where blog post is not found
  if (!member) {
    notFound();
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
            <Button variant="secondary" className="rounded-sm items-center">
              Save
            </Button>
          </div>
        </div>
      </div>
      <EditMemberComponent member={member} />
    </div>
  );
}
