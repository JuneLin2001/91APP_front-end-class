import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import PropTypes from "prop-types";
import styled from "styled-components";

const MarkdownPreview = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ className, children, ...props }) {
          const isInline = !className && !/\n/.test(children);

          return isInline ? (
            <InlineCode className={className} {...props}>
              {children}
            </InlineCode>
          ) : (
            <CodeBlock className={className} {...props}>
              {children}
            </CodeBlock>
          );
        },
        img({ src, alt, ...props }) {
          return <StyledImage src={src} alt={alt} {...props} />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

MarkdownPreview.propTypes = {
  content: PropTypes.string.isRequired,
};

export default MarkdownPreview;

const CodeBlock = styled.pre`
  background-color: var(--bgColor-neutral-muted, var(--color-neutral-muted));
  padding: 10px;
  border-radius: 6px;
  overflow: auto;
  white-space: break-spaces;
`;

const InlineCode = styled.code`
  background-color: var(--bgColor-neutral-muted, var(--color-neutral-muted));
  padding: 0.2em 0.4em;
  border-radius: 6px;
  font-size: 85%;
  white-space: break-spaces;
  margin: 0;
`;

const StyledImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
`;
