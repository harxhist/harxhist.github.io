import {
  Avatar,
  Button,
  Column,
  Heading,
  Icon,
  IconButton,
  Tag,
  Text,
  Meta,
  Schema,
  Row,
} from "@once-ui-system/core";
import { baseURL, cv, person, social } from "@/resources";
import { OptimizedMedia } from "@/components";
import TableOfContents from "@/components/cv/TableOfContents";
import styles from "@/components/cv/cv.module.scss";
import React from "react";

export async function generateMetadata() {
  return Meta.generate({
    title: cv.title,
    description: cv.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(cv.title)}`,
    path: cv.path,
  });
}

export default function CvPage() {
  const structure = [
    {
      title: cv.intro.title,
      display: cv.intro.display,
      items: [],
    },
    {
      title: cv.work.title,
      display: cv.work.display,
      items: cv.work.experiences.map((experience) => experience.company),
    },
    {
      title: cv.studies.title,
      display: cv.studies.display,
      items: cv.studies.institutions.map((institution) => institution.name),
    },
    {
      title: cv.technical.title,
      display: cv.technical.display,
      items: cv.technical.skills.map((skill) => skill.title),
    },
  ];
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={cv.title}
        description={cv.description}
        path={cv.path}
        image={`/api/og/generate?title=${encodeURIComponent(cv.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${cv.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      {cv.tableOfContent.display && (
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          s={{ hide: true }}
        >
          <TableOfContents structure={structure} cv={cv} />
        </Column>
      )}
      <Row fillWidth s={{ direction: "column"}} horizontal="center">
        {cv.avatar.display && (
          <Column
            className={styles.avatar}
            top="64"
            fitHeight
            position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <Avatar src={person.avatar} size="xl" />
            <Row gap="8" vertical="center">
              <Icon onBackground="accent-weak" name="globe" />
              {person.location}
            </Row>
            {person.languages && person.languages.length > 0 && (
              <Row wrap gap="8">
                {person.languages.map((language, index) => (
                  <Tag key={index} size="l">
                    {language}
                  </Tag>
                ))}
              </Row>
            )}
          </Column>
        )}
        <Column className={styles.blockAlign} flex={9} maxWidth={40}>
          <Column
            id={cv.intro.title}
            fillWidth
            minHeight="160"
            vertical="center"
            marginBottom="32"
          >
            {cv.calendar.display && (
              <Row
                fitWidth
                border="brand-alpha-medium"
                background="brand-alpha-weak"
                radius="full"
                padding="4"
                gap="8"
                marginBottom="m"
                vertical="center"
                className={styles.blockAlign}
                style={{
                  backdropFilter: "blur(var(--static-space-1))",
                }}
              >
                <Icon paddingLeft="12" name="calendar" onBackground="brand-weak" />
                <Row paddingX="8">Schedule a call</Row>
                <IconButton
                  href={cv.calendar.link}
                  data-border="rounded"
                  variant="secondary"
                  icon="chevronRight"
                />
              </Row>
            )}
            <Heading className={styles.textAlign} variant="display-strong-xl">
              {person.name}
            </Heading>
            <Text
              className={styles.textAlign}
              variant="display-default-xs"
              onBackground="neutral-weak"
            >
              {person.role}
            </Text>
            {social.length > 0 && (
              <Row
                className={styles.blockAlign}
                paddingTop="20"
                paddingBottom="8"
                gap="8"
                wrap
                horizontal="center"
                fitWidth
                data-border="rounded"
              >
                {social
                  .filter((item) => item.essential)
                  .map(
                    (item) =>
                      item.link && (
                        <React.Fragment key={item.name}>
                          <Row s={{ hide: true }}>
                            <Button
                              key={item.name}
                              href={item.link}
                              prefixIcon={item.icon}
                              label={item.name}
                              size="s"
                              weight="default"
                              variant="secondary"
                              {...(item.name === "Resume"
                                ? { target: "_blank", rel: "noopener noreferrer" }
                                : {})}
                            />
                          </Row>
                          <Row hide s={{ hide: false }}>
                            <IconButton
                              size="l"
                              key={`${item.name}-icon`}
                              href={item.link}
                              icon={item.icon}
                              variant="secondary"
                              {...(item.name === "Resume"
                                ? { target: "_blank", rel: "noopener noreferrer" }
                                : {})}
                            />
                          </Row>
                        </React.Fragment>
                      ),
                  )}
              </Row>
            )}
          </Column>

          {cv.intro.display && (
            <Column textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
              {cv.intro.description}
            </Column>
          )}

          {cv.work.display && (
            <>
              <Heading as="h2" onBackground="brand-weak" id={cv.work.title} variant="display-strong-s" marginBottom="s">
                {cv.work.title}
              </Heading>
              <Column fillWidth gap="l" marginBottom="0">
                {cv.work.experiences.map((experience, index) => (
                  <Column key={`${experience.company}-${experience.role}-${index}`} fillWidth>
                    <Row fillWidth horizontal="between" vertical="end" marginBottom="0">
                      <Text id={experience.company} variant="heading-strong-l">
                        {experience.company}
                      </Text>
                      <Text variant="heading-default-xs" onBackground="neutral-weak">
                        {experience.timeframe}
                      </Text>
                    </Row>
                    <Text variant="body-default-s" onBackground="neutral-weak" marginBottom="s">
                      {experience.role}
                    </Text>
                    <Column as="ul" gap="0">
                      {experience.achievements.map(
                        (achievement: React.ReactNode, index: number) => (
                          <Text
                            as="li"
                            variant="body-default-s"
                            key={`${experience.company}-${index}`}
                          >
                            {achievement}
                          </Text>
                        ),
                      )}
                    </Column>
                    {experience.images && experience.images.length > 0 && (
                      <Row fillWidth paddingTop="s" paddingLeft="40" gap="2" wrap>
                        {experience.images.map((image, index) => (
                          <Row
                            key={index}
                            border="neutral-medium"
                            radius="s"
                            minWidth={image.width}
                            height={image.height}
                          >
                            <OptimizedMedia
                              radius="var(--radius-s, 4px)"
                              sizes={image.width.toString()}
                              alt={image.alt}
                              src={image.src}
                              aspectRatio={`${image.width} / ${image.height}`}
                              style={{ minWidth: image.width, height: image.height }}
                            />
                          </Row>
                        ))}
                      </Row>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}

          {cv.studies.display && (
            <>
              <Heading as="h2" onBackground="brand-weak" id={cv.studies.title} variant="display-strong-s" marginBottom="m">
                {cv.studies.title}
              </Heading>
              <Column fillWidth gap="l" marginBottom="40">
                {cv.studies.institutions.map((institution, index) => (
                  <Column key={`${institution.name}-${index}`} fillWidth gap="4">
                    <Text id={institution.name} variant="heading-strong-l">
                      {institution.name}
                    </Text>
                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                      {institution.description}
                    </Text>
                  </Column>
                ))}
              </Column>
            </>
          )}

          {cv.technical.display && (
            <>
              <Heading
                as="h2"
                onBackground="brand-weak"
                id={cv.technical.title}
                variant="display-strong-s"
                marginBottom="40"
              >
                {cv.technical.title}
              </Heading>
              <Column fillWidth gap="l">
                {cv.technical.skills.map((skill, index) => (
                  <Column key={`${skill}-${index}`} fillWidth gap="4">
                    <Text id={skill.title} variant="heading-strong-l">
                      {skill.title}
                    </Text>
                    <Text variant="body-default-m" onBackground="neutral-weak">
                      {skill.description}
                    </Text>
                    {skill.tags && skill.tags.length > 0 && (
                      <Row wrap gap="8" paddingTop="8">
                        {skill.tags.map((tag, tagIndex) => (
                          <Tag key={`${skill.title}-${tagIndex}`} size="l" prefixIcon={tag.icon}>
                            {tag.name}
                          </Tag>
                        ))}
                      </Row>
                    )}
                    {skill.images && skill.images.length > 0 && (
                      <Row fillWidth paddingTop="m" gap="12" wrap>
                        {skill.images.map((image, index) => (
                          <Row
                            key={index}
                            border="neutral-medium"
                            radius="m"
                            minWidth={image.width}
                            height={image.height}
                          >
                            <OptimizedMedia
                              radius="var(--radius-m, 8px)"
                              sizes={image.width.toString()}
                              alt={image.alt}
                              src={image.src}
                              aspectRatio={`${image.width} / ${image.height}`}
                              style={{ minWidth: image.width, height: image.height }}
                            />
                          </Row>
                        ))}
                      </Row>
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}
        </Column>
      </Row>
    </Column>
  );
}