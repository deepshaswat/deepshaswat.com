import type { MemberInput } from "@repo/actions";
import { importMembers } from "@repo/actions";
import { Button, Input, Label } from "@repo/ui";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ImportMembersComponentProps {
  onClose: () => void;
}

export default function ImportMembersComponent({
  onClose,
}: ImportMembersComponentProps): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<MemberInput[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "text/csv") {
      toast.error("Please upload a CSV file");
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (readerEvent): void => {
      const text = readerEvent.target?.result as string;
      const rows = text.split("\n");
      const headers = rows[0].toLowerCase().split(",");

      const preview = rows
        .slice(1, 6)
        .map((row) => {
          const values = row.split(",");
          return {
            email: values[headers.indexOf("email")]?.trim(),
            firstName: values[headers.indexOf("first_name")]?.trim(),
            lastName: values[headers.indexOf("last_name")]?.trim(),
            unsubscribed:
              values[headers.indexOf("subscribed_to")]?.trim().toLowerCase() !==
              "false",
          };
        })
        .filter((member) => member.email);

      setPreviewData(preview as MemberInput[]);
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async (): Promise<void> => {
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      const rows = text.split("\n");
      const headers = rows[0].toLowerCase().split(",");

      const members = rows
        .slice(1)
        .map((row) => {
          const values = row.split(",");
          return {
            email: values[headers.indexOf("email")]?.trim(),
            firstName: values[headers.indexOf("first_name")]?.trim() || "",
            lastName: values[headers.indexOf("last_name")]?.trim() || "",
            unsubscribed:
              values[headers.indexOf("subscribed_to")]?.trim().toLowerCase() !==
              "false",
            note: "",
            openRate: "N/A",
            location: "Unknown",
            imageUrl: "",
            resendContactId: "",
          } as MemberInput;
        })
        .filter((member) => member.email);

      // Start import in background
      await importMembers(members)
        .then((response) => {
          if (response.error) {
            toast.error("Failed to import members");
          } else {
            toast.success(`Imported ${response.count} members successfully`);
          }
          setIsLoading(false);
          setFile(null);
          setPreviewData([]);
        })
        .catch((_error) => {
          toast.error("Failed to import members");
          setIsLoading(false);
          setFile(null);
          setPreviewData([]);
        });

      // Close dialog but let import continue in background
      onClose();
    } catch (error) {
      toast.error("Failed to import members");
      setIsLoading(false);
      setFile(null);
      setPreviewData([]);
    }
  };

  const truncateEmail = (email: string): string => {
    if (email.length > 20) {
      return `${email.slice(0, 20)}...`;
    }
    return email;
  };

  return (
    <div>
      <div className="px-6">
        <div className="space-y-6">
          <div>
            <Label
              className="text-sm font-medium text-neutral-300 block mb-2"
              htmlFor="file"
            >
              CSV File
            </Label>
            <Input
              accept=".csv"
              className="bg-neutral-800 border-0 text-white cursor-pointer h-12 text-sm"
              disabled={isLoading}
              id="file"
              onChange={(e) => {
                handleFileChange(e);
              }}
              type="file"
            />
          </div>

          {previewData.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-neutral-300">
                Preview (first 5 rows):
              </h3>
              <div className="rounded bg-neutral-800/50">
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-700">
                        <th className="text-left py-2 px-4 text-sm font-normal text-neutral-400">
                          Email
                        </th>
                        <th className="text-left py-2 px-4 text-sm font-normal text-neutral-400">
                          First Name
                        </th>
                        <th className="text-left py-2 px-4 text-sm font-normal text-neutral-400">
                          Last Name
                        </th>
                        <th className="text-left py-2 px-4 text-sm font-normal text-neutral-400">
                          Subscribed
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row) => (
                        <tr key={row.email}>
                          <td className="py-2 px-4 text-sm text-white">
                            {truncateEmail(row.email)}
                          </td>
                          <td className="py-2 px-4 text-sm text-white">
                            {row.firstName}
                          </td>
                          <td className="py-2 px-4 text-sm text-white">
                            {row.lastName}
                          </td>
                          <td className="py-2 px-4 text-sm">
                            <span className="text-red-500">
                              {row.unsubscribed ? "No" : "Yes"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="px-6 mt-6">
        <Button
          className="w-full bg-white text-black hover:bg-neutral-100 h-11"
          disabled={!file || isLoading}
          onClick={() => {
            void handleImport();
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            "Import Members"
          )}
        </Button>
      </div>
    </div>
  );
}
