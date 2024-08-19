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

const FilterListComponent = () => {
  const [filters, setFilters] = useState([
    { category: "Name", operator: "is", value: "" },
  ]);

  const addFilter = () => {
    setFilters([...filters, { category: "Name", operator: "is", value: "" }]);
  };

  const removeFilter = (index: number) => {
    const updatedFilters = filters.filter((_, i) => i !== index);
    setFilters(updatedFilters);
  };

  const updateFilter = (index: number, key: string, value: string) => {
    const updatedFilters = filters.map((filter, i) =>
      i === index ? { ...filter, [key]: value } : filter,
    );
    setFilters(updatedFilters);
  };

  const applyFilters = () => {
    // Handle the application of filters
    console.log(filters);
  };

  const resetFilters = () => {
    setFilters([{ category: "Name", operator: "is", value: "" }]);
  };

  return (
    <div className="p-4  rounded-md">
      <div className="bg-neutral-900 p-6 mb-4 rounded-md">
        {filters.map((filter, index) => (
          <div key={index} className="flex items-center gap-2 mb-4">
            <select
              value={filter.category}
              onChange={(e) => updateFilter(index, "category", e.target.value)}
              className="flex items-center justify-center h-8 pl-10  rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-800 px-3 py-2 text-sm file:text-sm file:font-medium  disabled:cursor-not-allowed w-48 lg:w-64 pr-1"
            >
              {filterCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={filter.operator}
              onChange={(e) => updateFilter(index, "operator", e.target.value)}
              className="flex items-center justify-center h-8 pl-10  rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-800 px-3 py-2 text-sm file:text-sm file:font-medium  disabled:cursor-not-allowed w-36 lg:w-48"
            >
              {filterOperators.map((operator) => (
                <option key={operator} value={operator}>
                  {operator}
                </option>
              ))}
            </select>
            <div className="flex items-center bg-neutral-800 border-2 border-transparent focus-within:border-green-500 rounded-md">
              <input
                type="text"
                value={filter.value}
                onChange={(e) => updateFilter(index, "value", e.target.value)}
                className="flex h-8 pl-10 w-full rounded-md text-neutral-300 ring-0 focus:ring-0 focus:outline-none bg-neutral-800 px-3 py-2 text-sm file:text-sm file:font-medium  disabled:cursor-not-allowed focus:bg-neutral-900 disabled:opacity-50"
              />
            </div>
            {filters.length > 1 && (
              <Button
                onClick={() => removeFilter(index)}
                variant="ghost"
                className="text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          onClick={addFilter}
          variant="link"
          className="text-green-500 !no-underline !ml-0"
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
};

export default FilterListComponent;
