import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { ReactNode } from "react";
import { slugify as transliterate } from "transliteration";

import {
  Heading,
  HeadingLink,
  Text,
  InlineCode,
  CodeBlock,
  TextProps,
  MediaProps,
  Accordion,
  AccordionGroup,
  Table,
  Feedback,
  Button,
  Card,
  Grid,
  Row,
  Column,
  Icon,
  Media,
  SmartLink,
  List,
  ListItem,
  Line,
} from "@once-ui-system/core";
import { OptimizedImage } from "@/components/OptimizedMedia";

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <SmartLink href={href} {...props}>
        {children}
      </SmartLink>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function createImage({ alt, src }: MediaProps & { src: string }) {
  if (!src) {
    console.error("Media requires a valid 'src' property.");
    return null;
  }

  const isSvg = src.endsWith(".svg");

  if (isSvg) {
    return (
      <div
        style={{
          width: "100%",
          marginTop: 8,
          marginBottom: 16,
          overflowX: "auto",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    );
  }

  return (
    <OptimizedImage
      alt={alt ?? ""}
      src={src}
      aspectRatio="16 / 9"
      sizes="(max-width: 960px) 100vw, 960px"
      radius="var(--radius-m, 8px)"
      style={{ marginTop: 8, marginBottom: 16 }}
    />
  );
}

function slugify(str: string): string {
  const strWithAnd = str.replace(/&/g, " and "); // Replace & with 'and'
  return transliterate(strWithAnd, {
    lowercase: true,
    separator: "-", // Replace spaces with -
  }).replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const CustomHeading = ({
    children,
    ...props
  }: Omit<React.ComponentProps<typeof HeadingLink>, "as" | "id">) => {
    const slug = slugify(children as string);
    return (
      <HeadingLink marginTop="24" marginBottom="12" as={as} id={slug} {...props}>
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = `${as}`;

  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return (
    <Text
      style={{ lineHeight: "175%" }}
      variant="body-default-m"
      onBackground="neutral-medium"
      marginTop="8"
      marginBottom="12"
    >
      {children}
    </Text>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return <InlineCode>{children}</InlineCode>;
}

function createCodeBlock(props: any) {
  if (props.children && props.children.props && props.children.props.className) {
    const { className, children } = props.children.props;
    const language = className.replace("language-", "");
    const label = language.charAt(0).toUpperCase() + language.slice(1);

    return (
      <CodeBlock
        marginTop="8"
        marginBottom="16"
        codes={[
          {
            code: children,
            language,
            label,
          },
        ]}
        copyButton={true}
      />
    );
  }

  return <pre {...props} />;
}

function createList(as: "ul" | "ol") {
  return ({ children }: { children: ReactNode }) => <List as={as}>{children}</List>;
}

function createListItem({ children }: { children: ReactNode }) {
  return (
    <ListItem marginTop="4" marginBottom="8" style={{ lineHeight: "175%" }}>
      {children}
    </ListItem>
  );
}

function createHR() {
  return (
    <Row fillWidth horizontal="center">
      <Line maxWidth="40" />
    </Row>
  );
}

const tableCellStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid var(--neutral-border-medium, rgba(255,255,255,0.12))",
  verticalAlign: "top",
  textAlign: "left",
  lineHeight: 1.6,
};

function createTable({ children }: { children: ReactNode }) {
  return (
    <div
      className="mdx-table-scroll"
      style={{
        overflowX: "auto",
        marginTop: 8,
        marginBottom: 16,
      }}
    >
      <table
        className="mdx-table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.9rem",
        }}
      >
        {children}
      </table>
    </div>
  );
}

function createTableHead({ children }: { children: ReactNode }) {
  return <thead>{children}</thead>;
}

function createTableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

function createTableRow({ children }: { children: ReactNode }) {
  return <tr>{children}</tr>;
}

function createTableHeader({ children }: { children: ReactNode }) {
  return (
    <th
      style={{
        ...tableCellStyle,
        textAlign: "left",
        fontWeight: 600,
        borderBottom: "2px solid var(--neutral-border-medium, rgba(255,255,255,0.2))",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

function createTableCell({ children }: { children: ReactNode }) {
  return <td style={tableCellStyle}>{children}</td>;
}

const tocIndent: Record<1 | 2 | 3, number> = { 1: 0, 2: 28, 3: 56 };

function BlogToc({ children }: { children: ReactNode }) {
  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        marginTop: 8,
        marginBottom: 24,
      }}
    >
      {children}
    </nav>
  );
}

function BlogTocItem({
  level = 1,
  index,
  href,
  children,
}: {
  level?: 1 | 2 | 3;
  index: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <div style={{ paddingLeft: tocIndent[level] }}>
      <Text variant="body-default-m" onBackground="neutral-medium" as="span" style={{ lineHeight: "175%" }}>
        {index}{" "}
        <a href={href}>{children}</a>
      </Text>
    </div>
  );
}

const components = {
  p: createParagraph as any,
  h1: createHeading("h1") as any,
  h2: createHeading("h2") as any,
  h3: createHeading("h3") as any,
  h4: createHeading("h4") as any,
  h5: createHeading("h5") as any,
  h6: createHeading("h6") as any,
  img: createImage as any,
  a: CustomLink as any,
  code: createInlineCode as any,
  pre: createCodeBlock as any,
  ol: createList("ol") as any,
  ul: createList("ul") as any,
  li: createListItem as any,
  hr: createHR as any,
  table: createTable as any,
  thead: createTableHead as any,
  tbody: createTableBody as any,
  tr: createTableRow as any,
  th: createTableHeader as any,
  td: createTableCell as any,
  BlogToc,
  BlogTocItem,
  Heading,
  Text,
  CodeBlock,
  InlineCode,
  Accordion,
  AccordionGroup,
  Table,
  Feedback,
  Button,
  Card,
  Grid,
  Row,
  Column,
  Icon,
  Media,
  SmartLink,
};

type CustomMDXProps = MDXRemoteProps & {
  components?: typeof components;
};

export function CustomMDX(props: CustomMDXProps) {
  return <MDXRemote {...props} components={{ ...components, ...(props.components || {}) }} />;
}
