import {
  CrossReferenceIcon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListUnorderedIcon,
  ListOrderedIcon,
  QuoteIcon,
  MentionIcon,
  CodeIcon,
  ReplyIcon,
  HeadingIcon,
  PaperclipIcon,
  DiffIgnoredIcon,
} from "@primer/octicons-react";

const actionBarButtons = [
  {
    icon: HeadingIcon,
    ariaLabel: "Attach files",
    action: (text) => `###${text}`,
  },
  { icon: BoldIcon, ariaLabel: "Bold", action: (text) => `**${text}**` },
  { icon: ItalicIcon, ariaLabel: "Italic", action: (text) => `_${text}_` },
  { icon: CodeIcon, ariaLabel: "Code", action: (text) => `\`${text}\`` },
  { icon: LinkIcon, ariaLabel: "Link", action: (text) => `[${text}](url)` },
  {
    icon: ListUnorderedIcon,
    ariaLabel: "Unordered list",
    action: (text) => `- ${text}`,
  },
  {
    icon: ListOrderedIcon,
    ariaLabel: "Ordered list",
    action: (text) => `1. ${text}`,
  },
  { icon: QuoteIcon, ariaLabel: "Quote", action: (text) => `> ${text}` },
  {
    icon: PaperclipIcon,
    ariaLabel: "Attach files",
    action: (text) => `![${text}](url)`,
  },
  { icon: MentionIcon, ariaLabel: "Mention", action: (text) => `@${text}` },
  {
    icon: CrossReferenceIcon,
    ariaLabel: "Reference",
    action: (text) => `#${text}`,
  },
  {
    icon: ReplyIcon,
    ariaLabel: "Saved replies",
    action: (text) => `${text}`,
  },
  {
    icon: DiffIgnoredIcon,
    ariaLabel: "Slash commands",
    action: (text) => `\\${text}`,
  },
];

export default actionBarButtons;
