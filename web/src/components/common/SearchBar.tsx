'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearch } from '@/hooks/useSearch';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onSearch?: (term: string) => void;
}

// 레벨별 스타일
const levelStyles: Record<string, { bg: string; text: string }> = {
  L1: { bg: 'bg-green-100', text: 'text-green-700' },
  L2: { bg: 'bg-blue-100', text: 'text-blue-700' },
  L3: { bg: 'bg-purple-100', text: 'text-purple-700' },
};

export default function SearchBar({
  placeholder = '단어 검색...',
  className = '',
  autoFocus = false,
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const {
    query,
    setQuery,
    results,
    isLoading,
    recentSearches,
    saveSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useSearch();

  const showDropdown = isFocused && (query || recentSearches.length > 0);

  // Handle search action
  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    saveSearch(term);

    if (onSearch) {
      onSearch(term);
    } else {
      router.push(`/words?search=${encodeURIComponent(term)}`);
    }

    setIsFocused(false);
    inputRef.current?.blur();
  };

  // Keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
    if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Highlight matching text
  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery) return text;

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input Field */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="
            w-full pl-10 pr-10 py-2.5
            bg-slate-100 border border-transparent rounded-xl
            focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
            transition-all outline-none text-sm
            placeholder:text-slate-400
          "
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="
            absolute top-full left-0 right-0 mt-2
            bg-white rounded-xl shadow-lg border border-slate-200
            max-h-96 overflow-y-auto z-50
          "
        >
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  최근 검색
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  전체 삭제
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <div
                    key={term}
                    className="
                      flex items-center gap-1 px-3 py-1.5
                      bg-slate-100 rounded-full text-sm
                      hover:bg-slate-200 transition-colors group
                    "
                  >
                    <button onClick={() => handleSearch(term)} className="text-slate-700">
                      {term}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(term);
                      }}
                      className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && (
            <div className="p-2">
              {isLoading ? (
                <div className="p-4 text-center text-slate-400">
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-brand-primary rounded-full animate-spin mx-auto mb-2" />
                  검색 중...
                </div>
              ) : results.length > 0 ? (
                <>
                  <p className="px-3 py-2 text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    추천 검색어
                  </p>
                  {results.map((result) => {
                    const levelStyle = levelStyles[result.level] || levelStyles.L1;

                    return (
                      <Link
                        key={result.id}
                        href={`/words/${result.id}`}
                        onClick={() => {
                          saveSearch(result.word);
                          setIsFocused(false);
                        }}
                        className="
                          w-full flex items-center justify-between
                          px-3 py-2.5 rounded-lg
                          hover:bg-slate-50 transition-colors text-left
                        "
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">📚</span>
                          <div>
                            <p className="font-medium text-slate-900">
                              {highlightMatch(result.word, query)}
                            </p>
                            <p className="text-sm text-slate-500 line-clamp-1">{result.definition}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded ${levelStyle.bg} ${levelStyle.text}`}
                        >
                          {result.level}
                        </span>
                      </Link>
                    );
                  })}
                </>
              ) : (
                <div className="p-4 text-center text-slate-400">
                  <span className="text-2xl mb-2 block">🔍</span>
                  '{query}'에 대한 검색 결과가 없습니다
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
