"use client";

import { Card, Column, Row, Avatar, Text } from "@once-ui-system/core";
import { OptimizedMedia } from "@/components";
import { formatDate } from "@/utils/formatDate";
import { person } from "@/resources";

interface PostProps {
  post: any;
  thumbnail: boolean;
  direction?: "row" | "column";
  /** Only set for the first hero post to avoid blocking LCP */
  priority?: boolean;
}

export default function Post({ post, thumbnail, direction, priority = false }: PostProps) {
  return (
    <Card
      fillWidth
      key={post.slug}
      href={`/blog/${post.slug}`}
      transition="micro-medium"
      direction={direction}
      border="transparent"
      background="transparent"
      padding="4"
      radius="l-4"
      gap={direction === "column" ? undefined : "24"}
      s={{ direction: "column" }}
    >
      {post.metadata.image && thumbnail && (
        <OptimizedMedia
          priority={priority}
          sizes="(max-width: 768px) 100vw, 640px"
          radius="var(--radius-l, 12px)"
          src={post.metadata.image}
          alt={"Thumbnail of " + post.metadata.title}
          aspectRatio="16 / 9"
        />
      )}
      <Row fillWidth>
        <Column maxWidth={28} paddingY="24" paddingX="l" gap="20" vertical="center">
          <Row gap="24" vertical="center">
            <Row vertical="center" gap="16">
              <Avatar src={person.avatar} size="s" />
              <Text variant="label-default-s">{person.name}</Text>
            </Row>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              {formatDate(post.metadata.publishedAt, false)}
            </Text>
          </Row>
          <Text variant="heading-strong-l" wrap="balance">
            {post.metadata.title}
          </Text>
          {post.metadata.tag && (
            <Text variant="label-strong-s" onBackground="neutral-weak">
              {post.metadata.tag}
            </Text>
          )}
        </Column>
      </Row>
    </Card>
  );
}
