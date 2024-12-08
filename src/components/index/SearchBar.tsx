import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  className?: string;
}

export const SearchBar = ({ searchQuery, onSearchChange, className = '' }: SearchBarProps) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search menu..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};