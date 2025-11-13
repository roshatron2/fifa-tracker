'use client';

import { ChevronDownIcon } from '@/components/Icons';
import { useEffect, useRef, useState } from 'react';

interface OptionItem {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: string[] | OptionItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  searchable?: boolean;
  disabled?: boolean;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  searchable = false,
  disabled = false,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Helper functions to work with both string and object options
  const isOptionItem = (option: string | OptionItem): option is OptionItem => {
    return typeof option === 'object' && 'value' in option && 'label' in option;
  };

  const getOptionValue = (option: string | OptionItem): string => {
    return isOptionItem(option) ? option.value : option;
  };

  const getOptionLabel = (option: string | OptionItem): string => {
    return isOptionItem(option) ? option.label : option;
  };

  const getDisplayValue = (): string => {
    if (!value) return '';
    const option = options.find(opt => getOptionValue(opt) === value);
    return option ? getOptionLabel(option) : value;
  };

  // Fuzzy search function
  const fuzzySearch = (text: string, query: string): boolean => {
    if (!query) return true;
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    let queryIndex = 0;
    for (
      let i = 0;
      i < textLower.length && queryIndex < queryLower.length;
      i++
    ) {
      if (textLower[i] === queryLower[queryIndex]) {
        queryIndex++;
      }
    }
    return queryIndex === queryLower.length;
  };

  const filteredOptions = searchable
    ? options.filter(option => fuzzySearch(getOptionLabel(option), searchTerm))
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Only handle if the dropdown is focused or open
      if (dropdownRef.current?.contains(document.activeElement) || isOpen) {
        if (event.key === 'Escape' && isOpen) {
          setIsOpen(false);
          setSearchTerm('');
          setHighlightedIndex(-1);
          buttonRef.current?.focus();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    } else if (isOpen && !searchable && buttonRef.current) {
      // Ensure the button maintains focus when dropdown opens without search
      buttonRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Reset highlighted index when options change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredOptions]);

  const handleSelect = (option: string | OptionItem) => {
    if (disabled) return;
    onChange(getOptionValue(option));
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    console.log('Key pressed:', event.key, 'isOpen:', isOpen); // Debug log

    if (!isOpen) {
      if (
        event.key === 'Enter' ||
        event.key === ' ' ||
        event.key === 'ArrowDown'
      ) {
        event.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (
          highlightedIndex >= 0 &&
          highlightedIndex < filteredOptions.length
        ) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(0);
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (disabled) return;
          setIsOpen(!isOpen);
          if (!isOpen) {
            setHighlightedIndex(0);
          } else {
            setHighlightedIndex(-1);
          }
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => console.log('Button focused')} // Debug log
        disabled={disabled}
        className={`w-full bg-[#2d3748] text-white px-3 py-2 rounded-lg border border-gray-600 text-left text-sm sm:text-base focus:outline-none focus:border-blue-500 flex items-center justify-between ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={value ? 'text-white' : 'text-gray-400'}>
          {getDisplayValue() || placeholder}
        </span>
        <ChevronDownIcon
          className={`text-gray-400 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#2d3748] border border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {searchable && (
            <div className="sticky top-0 bg-[#2d3748] p-2 border-b border-gray-600">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search..."
                className="w-full bg-[#1a1f2e] text-white px-3 py-2 rounded border border-gray-600 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {filteredOptions.length > 0 ? (
            <div role="listbox">
              {filteredOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full px-3 py-2 text-left text-sm sm:text-base hover:bg-[#374151] transition-colors ${
                    getOptionValue(option) === value
                      ? 'bg-blue-500 text-white'
                      : index === highlightedIndex
                        ? 'bg-[#374151] text-white'
                        : 'text-white'
                  } ${index === 0 && !searchable ? 'rounded-t-lg' : ''} ${index === filteredOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                  role="option"
                  aria-selected={getOptionValue(option) === value}
                >
                  {getOptionValue(option) === value && (
                    <span className="inline-block w-4 h-4 mr-2">✓</span>
                  )}
                  {getOptionLabel(option)}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-2 text-gray-400 text-sm">
              No options found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
