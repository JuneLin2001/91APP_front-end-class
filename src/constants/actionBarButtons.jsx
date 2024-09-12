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
  { icon: HeadingIcon, ariaLabel: "Attach files" },
  { icon: BoldIcon, ariaLabel: "Bold" },
  { icon: ItalicIcon, ariaLabel: "Italic" },
  { icon: CodeIcon, ariaLabel: "Code" },
  { icon: LinkIcon, ariaLabel: "Link" },
  { icon: ListUnorderedIcon, ariaLabel: "Unordered list" },
  { icon: ListOrderedIcon, ariaLabel: "Ordered list" },
  { icon: QuoteIcon, ariaLabel: "Quote" },
  { icon: PaperclipIcon, ariaLabel: "Data files attachment" },
  { icon: MentionIcon, ariaLabel: "Mention" },
  { icon: CrossReferenceIcon, ariaLabel: "Mention" },
  { icon: ReplyIcon, ariaLabel: "Mention" },
  { icon: DiffIgnoredIcon, ariaLabel: "Mention" },
];

export default actionBarButtons;
