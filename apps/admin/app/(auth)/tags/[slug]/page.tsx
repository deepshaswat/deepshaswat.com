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
import { fetchTagDetails } from "../../../../actions/fetch-tags";
import EditTagComponent from "../../_components/tags/edit-tag-component";

export default async function ({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const tag = await fetchTagDetails(slug);

  //Handle case where blog post is not found
  if (!tag) {
    notFound();
  }
  return (
    <div className='m-8  lg:ml-[156px] lg:mr-[156px]'>
      <div className=''>
        <div className='flex flex-row items-center justify-between mb-4 lg:mb-0 '>
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href='/tags'
                    className='text-neutral-200 hover:text-neutral-100'
                  >
                    Tags
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className='font-normal text-neutral-500'>
                    Edit tag
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className=' gap-20 justify-start'>
            <Button variant='secondary' className='rounded-sm items-center'>
              Save
            </Button>
          </div>
        </div>
      </div>
      <EditTagComponent tag={tag} />
    </div>
  );
}
