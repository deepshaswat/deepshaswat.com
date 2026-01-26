"use client";

import React, { useState } from "react";
import { Button } from "@repo/ui"; // Adjust the import path as needed
import { Plus, X } from "lucide-react";

const filterCategories = [
  "Name",
  "Email",
  "Label",
  "Newsletter subscription",
  "Last seen",
  "Created",
  "Signed up on post/page",
  "Emails sent (all time)",
  "Emails opened (all time)",
  "Open rate (all time)",
  "Sent email",
  "Opened email",
  "Clicked email",
  "Responded with feedback",
];

const filterOperators = [
  "is",
  "contains",
  "does not contain",
  "starts with",
  "ends with",
];

interface Filter {
  id: string;
  category: string;
  operator: string;
  value: string;
}

const generateId = (): string => Math.random().toString(36).substring(2, 9);

function FilterListComponent(): JSX.Element {
  const [filters, setFilters] = useState<Filter[]>([
    { id: generateId(), category: "Name", operator: "is", value: "" },
  ]);

  const addFilter = (): void => {
    setFilters([
      ...filters,
      { id: generateId(), category: "Name", operator: "is", value: "" },
    ]);
  };

  const removeFilter = (id: string): void => {
    const updatedFilters = filters.filter((filter) => filter.id !== id);
    setFilters(updatedFilters);
  };

  const updateFilter = (id: string, key: string, value: string): void => {
    const updatedFilters = filters.map((filter) =>
      filter.id === id ? { ...filter, [key]: value } : filter,
    );
    setFilters(updatedFilters);
  };

  const applyFilters = (): void => {
    // Handle the application of filters
    // eslint-disable-next-line no-console -- Debug logging for filter application
    console.log(filters);
  };

  const resetFilters = (): void => {
    setFilters([
      { id: generateId(), category: "Name", operator: "is", value: "" },
    ]);
  };

  return (
    <div className="p-4  rounded-md">
      <div className="bg-neutral-900 p-6 mb-4 rounded-md">
        {filters.map((filter) => (
          <div
            className="flex items-center gap-2 mb-4 w-full justify-between"
            key={filter.id}
          >
            <select
              className="flex items-center justify-center h-8   rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-800 px-3 py-2 text-sm file:text-sm file:font-medium  disabled:cursor-not-allowed w-48 lg:w-64 pr-1"
              onChange={(e) => {
                updateFilter(filter.id, "category", e.target.value);
              }}
              value={filter.category}
            >
              {filterCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className="flex items-center justify-center h-8  rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-800 px-3 py-2 text-sm file:text-sm file:font-medium  disabled:cursor-not-allowed w-36 lg:w-48"
              onChange={(e) => {
                updateFilter(filter.id, "operator", e.target.value);
              }}
              value={filter.operator}
            >
              {filterOperators.map((operator) => (
                <option key={operator} value={operator}>
                  {operator}
                </option>
              ))}
            </select>
            <div className="flex items-center bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md">
              <input
                className="flex h-8  w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-800 px-3 py-2 text-sm file:text-sm file:font-medium  disabled:cursor-not-allowed focus:bg-neutral-900 disabled:opacity-50"
                onChange={(e) => {
                  updateFilter(filter.id, "value", e.target.value);
                }}
                type="text"
                value={filter.value}
              />
            </div>
            {filters.length > 1 ? (
              <Button
                className="text-red-500"
                onClick={() => {
                  removeFilter(filter.id);
                }}
                variant="ghost"
              >
                <X className="w-4 h-4" />
              </Button>
            ) : null}
          </div>
        ))}
        <Button
          className="text-green-500 !no-underline !ml-0"
          onClick={addFilter}
          variant="link"
        >
          <Plus className="w-4 h-4 mr-2" /> Add filter
        </Button>
      </div>
      <div className="flex justify-between">
        <Button onClick={resetFilters} variant="icon">
          Reset all
        </Button>
        <Button onClick={applyFilters} variant="outline">
          Apply filters
        </Button>
      </div>
    </div>
  );
}

export default FilterListComponent;
