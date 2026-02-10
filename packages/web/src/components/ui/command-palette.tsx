import { useCallback, useEffect, useState } from "react";
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

type CommandItem = {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
  group: "navigation" | "actions" | "social";
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

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

  // Copy email to clipboard
  const copyEmail = useCallback(async () => {
    await navigator.clipboard.writeText("ryan@ryanyogan.com");
    setOpen(false);
  }, []);

  const commands: CommandItem[] = [
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
  ];

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

  if (!open) return null;

  return (
    <div className="command-palette-overlay" onClick={() => setOpen(false)}>
      <div
        className="command-palette-container"
        onClick={(e) => e.stopPropagation()}
      >
        <Command
          className="command-palette"
          shouldFilter={true}
          loop
        >
          <div className="command-input-wrapper">
            <SearchIcon size={16} className="command-search-icon" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="command-input"
              autoFocus
            />
            <kbd className="command-kbd">esc</kbd>
          </div>

          <Command.List className="command-list">
            <Command.Empty className="command-empty">
              No results found.
            </Command.Empty>

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
                    <kbd className="command-item-shortcut">{item.shortcut}</kbd>
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
                    <kbd className="command-item-shortcut">{item.shortcut}</kbd>
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
          </Command.List>

          <div className="command-footer">
            <span className="command-footer-hint">
              <kbd>press</kbd> navigate
            </span>
            <span className="command-footer-hint">
              <kbd>enter</kbd> select
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

// Keyboard hint component for header (legacy, keeping for compatibility)
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
        <span>cmd</span>K
      </kbd>
    </button>
  );
}
