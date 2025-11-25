
import React, { useState, useEffect } from 'react';
import { WorkerCategory } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface SearchBarProps {
  onSearch: (query: string, category: WorkerCategory | null) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<WorkerCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<WorkerCategory | null>(null);

  useEffect(() => {
    if (query.length > 1) {
      const allCategories = Object.values(WorkerCategory);
      const filtered = allCategories.filter(category =>
        category.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSuggestionClick = (category: WorkerCategory) => {
    setQuery(category);
    setSelectedCategory(category);
    setSuggestions([]);
    onSearch(category, category);
  };

  const handleSearch = () => {
    onSearch(query, selectedCategory);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="flex items-center bg-white rounded-full shadow-md">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedCategory(null);
          }}
          placeholder="Search for a service (e.g., 'Plumber', 'Electrician')"
          className="w-full px-6 py-3 text-lg text-gray-700 rounded-full focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none"
        >
          Search
        </button>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          {suggestions.map(category => (
            <li
              key={category}
              onClick={() => handleSuggestionClick(category)}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <span className="mr-2">{CATEGORY_ICONS[category]}</span>
              <span>{category}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
