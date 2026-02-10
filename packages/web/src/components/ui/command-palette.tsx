import { useCallback, useEffect, useState, useMemo } from "react";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "~/hooks/use-theme";
import { useCommandK, useEscape } from "~/hooks/use-keyboard-shortcut";
import {
  HomeIcon,
  DocumentIcon,
  ProjectIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  SearchIcon,
  CopyIcon,
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
} from "./icons";
import type { SearchResponse, SearchResult } from "~/routes/api/search";

type CommandItem = {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
  group: "navigation" | "actions" | "social";
};

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Debounce search query
  const debouncedSearch = useDebounce(search, 200);

  // Open with CMD+K
  useCommandK(
    useCallback(() => setOpen(true), []),
    !open
  );

  // Close with Escape
  useEscape(
    useCallback(() => setOpen(false), []),
    open
  );

  // Fetch search results when debounced search changes
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setSearchResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedSearch)}`
        );
        if (response.ok) {
          const data: SearchResponse = await response.json();
          setSearchResults(data.results);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  // Clear search when closing
  useEffect(() => {
    if (!open) {
      setSearch("");
      setSearchResults([]);
    }
  }, [open]);

  // Copy email to clipboard
  const copyEmail = useCallback(async () => {
    await navigator.clipboard.writeText("ryan@ryanyogan.com");
    setOpen(false);
  }, []);

  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: "home",
        label: "Home",
        shortcut: "H",
        icon: <HomeIcon size={16} />,
        action: () => {
          navigate({ to: "/" });
          setOpen(false);
        },
        group: "navigation",
      },
      {
        id: "work",
        label: "Work",
        shortcut: "W",
        icon: <UserIcon size={16} />,
        action: () => {
          navigate({ to: "/work" });
          setOpen(false);
        },
        group: "navigation",
      },
      {
        id: "writing",
        label: "Writing",
        shortcut: "B",
        icon: <DocumentIcon size={16} />,
        action: () => {
          navigate({ to: "/writing" });
          setOpen(false);
        },
        group: "navigation",
      },
      {
        id: "projects",
        label: "Projects",
        shortcut: "P",
        icon: <ProjectIcon size={16} />,
        action: () => {
          navigate({ to: "/projects" });
          setOpen(false);
        },
        group: "navigation",
      },
      // Actions
      {
        id: "theme",
        label: theme === "dark" ? "Light Mode" : "Dark Mode",
        shortcut: "T",
        icon: theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />,
        action: () => {
          toggleTheme();
          setOpen(false);
        },
        group: "actions",
      },
      {
        id: "copy-email",
        label: "Copy Email",
        shortcut: "E",
        icon: <CopyIcon size={16} />,
        action: copyEmail,
        group: "actions",
      },
      // Social
      {
        id: "github",
        label: "GitHub",
        icon: <GitHubIcon size={16} />,
        action: () => {
          window.open("https://github.com/ryanyogan", "_blank");
          setOpen(false);
        },
        group: "social",
      },
      {
        id: "twitter",
        label: "Twitter",
        icon: <TwitterIcon size={16} />,
        action: () => {
          window.open("https://twitter.com/ryanyogan", "_blank");
          setOpen(false);
        },
        group: "social",
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        icon: <LinkedInIcon size={16} />,
        action: () => {
          window.open("https://linkedin.com/in/ryanyogan", "_blank");
          setOpen(false);
        },
        group: "social",
      },
    ],
    [theme, toggleTheme, navigate, copyEmail]
  );

  // Group commands
  const navigation = commands.filter((c) => c.group === "navigation");
  const actions = commands.filter((c) => c.group === "actions");
  const social = commands.filter((c) => c.group === "social");

  // Handle keyboard shortcuts when modal is open
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for single-letter shortcuts
      const key = e.key.toLowerCase();
      const cmd = commands.find(
        (c) => c.shortcut?.toLowerCase() === key && !e.metaKey && !e.ctrlKey
      );
      if (cmd && search === "") {
        e.preventDefault();
        cmd.action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, search, commands]);

  // Navigate to search result
  const handleSearchResultSelect = useCallback(
    (result: SearchResult) => {
      if (result.url.startsWith("http")) {
        window.open(result.url, "_blank");
      } else {
        navigate({ to: result.url });
      }
      setOpen(false);
    },
    [navigate]
  );

  if (!open) return null;

  const hasSearchResults = searchResults.length > 0;
  const showSearchResults = search.length >= 2;

  return (
    <div className="command-palette-overlay" onClick={() => setOpen(false)}>
      <div
        className="command-palette-container"
        onClick={(e) => e.stopPropagation()}
      >
        <Command
          className="command-palette"
          shouldFilter={!showSearchResults}
          loop
        >
          <div className="command-input-wrapper">
            <SearchIcon size={16} className="command-search-icon" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search posts, projects, or type a command..."
              className="command-input"
              autoFocus
            />
            {isSearching && (
              <span className="command-loading">Searching...</span>
            )}
            <kbd className="command-kbd">esc</kbd>
          </div>

          <Command.List className="command-list">
            <Command.Empty className="command-empty">
              {isSearching ? "Searching..." : "No results found."}
            </Command.Empty>

            {/* Search Results */}
            {showSearchResults && hasSearchResults && (
              <Command.Group heading="Search Results" className="command-group">
                {searchResults.map((result) => (
                  <Command.Item
                    key={result.id}
                    value={`search-${result.id}`}
                    onSelect={() => handleSearchResultSelect(result)}
                    className="command-item"
                  >
                    <span className="command-item-icon">
                      {result.type === "post" ? (
                        <DocumentIcon size={16} />
                      ) : (
                        <ProjectIcon size={16} />
                      )}
                    </span>
                    <div className="command-item-content">
                      <span className="command-item-label">{result.title}</span>
                      <span className="command-item-description">
                        {result.description.slice(0, 60)}
                        {result.description.length > 60 ? "..." : ""}
                      </span>
                    </div>
                    <span className="command-item-type">
                      {result.type}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Show commands when not searching or no results */}
            {(!showSearchResults || !hasSearchResults) && (
              <>
                <Command.Group heading="Navigation" className="command-group">
                  {navigation.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={item.label}
                      onSelect={item.action}
                      className="command-item"
                    >
                      <span className="command-item-icon">{item.icon}</span>
                      <span className="command-item-label">{item.label}</span>
                      {item.shortcut && (
                        <kbd className="command-item-shortcut">
                          {item.shortcut}
                        </kbd>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Actions" className="command-group">
                  {actions.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={item.label}
                      onSelect={item.action}
                      className="command-item"
                    >
                      <span className="command-item-icon">{item.icon}</span>
                      <span className="command-item-label">{item.label}</span>
                      {item.shortcut && (
                        <kbd className="command-item-shortcut">
                          {item.shortcut}
                        </kbd>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Social" className="command-group">
                  {social.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={item.label}
                      onSelect={item.action}
                      className="command-item"
                    >
                      <span className="command-item-icon">{item.icon}</span>
                      <span className="command-item-label">{item.label}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </>
            )}
          </Command.List>

          <div className="command-footer">
            <span className="command-footer-hint">
              <kbd>↑↓</kbd> navigate
            </span>
            <span className="command-footer-hint">
              <kbd>↵</kbd> select
            </span>
            <span className="command-footer-hint">
              <kbd>esc</kbd> close
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}

// Keyboard hint component for header
export function CommandKHint() {
  return (
    <button
      onClick={() => {
        const event = new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
          bubbles: true,
        });
        window.dispatchEvent(event);
      }}
      className="command-k-hint"
      aria-label="Open command palette"
    >
      <SearchIcon size={14} />
      <span className="command-k-hint-text">Search</span>
      <kbd className="command-k-hint-kbd">
        <span>⌘</span>K
      </kbd>
    </button>
  );
}
