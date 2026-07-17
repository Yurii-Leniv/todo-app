"use client";

import { useEffect, useState } from "react";

type Props = {
  onSearch: (value: string) => void;
};

// Delay before firing the search request after the user stops typing.
const DEBOUNCE_MS = 300;

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // onSearch is intentionally left out of the deps: if the parent passes a
    // new function on every render, adding it here would restart the timer
    // on every render instead of only when the search text changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="text"
      placeholder="Search tasks..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-2.5 text-sm shadow-sm backdrop-blur-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
    />
  );
}
