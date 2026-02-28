import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Harsh",
  lastName: "Rajput",
  name: `Harsh Rajput`,
  role: "Software Engineer",
  avatar: "/images/avatar.jpg",
  email: "harxhist@gmail.com",
  location: "Asia/Kolkata",
  languages: ["English", "Hindi"],
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/harxhist",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/hrxh",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/harxhist",
    essential: false,
  },
  {
    name: "Twitter",
    icon: "twitter",
    link: "https://www.x.com/harxhist",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
  {
    name: "Resume",
    icon: "document",
    link: "/HarshRajput_resume.pdf",
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Building bridges with code</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Shorten</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/shorten",
  },
  subline: (
    <>
    I'm Selene, a design engineer at <Text as="span" size="xl" weight="strong">ONCE UI</Text>, where I craft intuitive <br /> user experiences. After hours, I build my own projects.
</>
  ),
  
  landing: {
    topLabel: "Harsh",
    displayName: "#harxhist",
    tagline: "Praise dev in devils",
    fixedAddress: "Here's my only fixed address",
    bio: "Backend dev. I build scalable systems and ship AI-focused infra. Hoping to conquer Everest base-camp this year.",
    cta: "Always interested in cool projects, reach out!",
    currentStatus: (
      <>
        <span style={{ fontSize: "20px", marginRight: "0.5rem" }}>⌖</span>
        Dehradun, India
      </>
    ),
    highlight: {
      icon: "♪",
      title: " Blend with me on Spotify ♪",
      href: "https://open.spotify.com/blend/taste-match/e49f9562086b36e8?si=utGlHoInSJOZ6z234s4CCA&fallback=getapp",
    },
    interests:
      "INTERESTS : open source, distributed systems, AI, books, brain, movies, music, mountains",
    dislikesTitle: "pure hate",
    dislikes: "PURE HATE: ads, red tape, bloatware, unnecessary meetings, waking up early",
    // linksSectionTitle: "sauce",
    linkItems: [
      { label: "github", href: social.find((s) => s.name === "GitHub")?.link ?? "#" },
      { label: "hire me", href: "/about" },
      { label: "email", href: `mailto:${person.email}` },
    ],
  },
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com/harxhist/15min",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Builds software that actually holds up. Microservices, AI inference at scale, infra that ships. Still chasing a sub30 5K run but I’ll crush you at table tennis.
      </>
    ),
  },
  work: {
    display: true, 
    title: "Work Experience",
    experiences: [
      {
        company: "Exotel",
        timeframe: "2025",
        role: "Member of Technical Staff-1 @ Legs Platform",
        achievements: [],
        images: [],
      },
      {
        company: "Unique Identification Authority of India",
        timeframe: "2023-24",
        role: "SDE-1 @ New SEDA Team",
        achievements: [],
        images: [],
      },
      {
        company: "Coding Ninjas",
        timeframe: "2022",
        role: "intern @ Doubt Solver Team",
        achievements: [],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Studies",
    institutions: [
      {
        name: "Indian Institute of Technology, Kanpur",
        description: <>B.Tech. in Bioengineering</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical skills",
    skills: [
      {
        title: "Languages & Libraries",
        description: (
          <></>
        ),
        tags: [
          {
            name: "Go",
            icon: "golang",
          },
         
          {
            name: "Java",
            icon: "java",
          },
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "React",
            icon: "react",
          },
          {
            name: "Next.js",
            icon: "nextjs",
          },
        ],
        images: [
          
        ],
      },
      {
        title: "Technologies",
        description: (
          <></>
        ),
        tags: [
          {
            name: "MySQL",
            icon: "mysql",
          },
          {
            name: "Redis",
            icon: "redis",
          },
          {
            name: "Kafka",
            icon: "kafka",
          },
          {
            name: "Docker",
            icon: "docker",
          },
          {
            name: "AWS",
            icon: "aws",
          },
        ],
        images: [
          
        ],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects`,
  description: `Design and dev projects by ${person.name}`,
  
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [
    { src: "/images/gallery/horizontal-1.jpg", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/horizontal-2.jpg", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/horizontal-3.jpg", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/horizontal-4.jpg", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/horizontal-5.jpg", alt: "image", orientation: "horizontal" },
    { src: "/images/gallery/vertical-1.jpg", alt: "image", orientation: "vertical" },
    { src: "/images/gallery/vertical-2.jpg", alt: "image", orientation: "vertical" },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
