"use client";

import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { NavBarPost } from "./navbar-post";
import { MetadataSidebar } from "./metadata-sidebar";

const NewPosts = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mainInputValue, setMainInputValue] = useState("");
  const [sidebarUrl, setSidebarUrl] = useState("");
  const [inputTimeIst, setInputTimeIst] = useState("23:00");
  const [inputExcerpt, setInputExcerpt] = useState("");
  const [inputDate, setInputDate] = useState<Date>(new Date());
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleMainInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainInputValue(e.target.value);
  };

  const handleSidebarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSidebarUrl(e.target.value);
  };

  const handleTimeIstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTimeIst(e.target.value);
  };
  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputExcerpt(e.target.value);
  };

  return (
    <div className="flex">
      <div className={`flex-1 ${isOpen ? " mr-[400px]" : ""}`}>
        <NavBarPost isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <div className="ml-10 max-w-screen-xl">
          Create new Posts
          <input
            type="text"
            placeholder="Title"
            value={mainInputValue}
            onChange={handleMainInputChange}
          />
        </div>
      </div>
      {isOpen && (
        <MetadataSidebar
          inputUrl={sidebarUrl}
          onInputUrlChange={handleSidebarUrlChange}
          inputTimeIst={inputTimeIst}
          setInputTimeIst={handleTimeIstChange}
          setInputDate={setInputDate}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          inputExcerpt={inputExcerpt}
          setInputExcerpt={handleExcerptChange}
        />
      )}
    </div>
  );
};

export { NewPosts };
