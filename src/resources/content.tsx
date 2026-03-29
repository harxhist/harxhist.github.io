import { Bio, Blog, Cv, Gallery, Home, Newsletter, Person, ProjectsPage, Social } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Harsh",
  lastName: "",
  name: "Harsh",
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
    link: "https://www.linkedin.com/in/harxhist",
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
    link: "/Harsh_resume.pdf",
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}`,
  description: `Portfolio website showcasing my projects as a ${person.role}`,
  headline: <>Building bridges with code</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Shorten</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured projects
        </Text>
      </Row>
    ),
    href: "/projects/shorten",
  },
  subline: (
    <>Building bridges with code</>
  ),
  
  landing: {
    topLabel: "Harsh",
    displayName: (
      <>
        harxhist
        <span
          className="terminal-cursor"
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "0.5em",
            height: "0.90em",
            marginRight: "0.35em",
            background: "#00ff41",
            borderRadius: "1px",
            verticalAlign: "-0.08em",
          }}
        />
      </>
    ),
    tagline: "Praise dev in devils",
    fixedAddress: "Here's my only fixed address",
    bio: "<This world is a courtroom. I could defend, but I'm giggling./>",
    cta: "Always interested in cool/unique stuff, reach out!",
    // currentStatus: (
    //   <>
    //     <span style={{ fontSize: "20px", marginRight: "0.5rem" }}>⌖</span>
    //     Dehradun, India
    //   </>
    // ),
    // highlight: {
    //   icon: "♪",
    //   title: " Blend with me on Spotify ♪",
    //   href: "https://open.spotify.com/blend/taste-match/e49f9562086b36e8?si=utGlHoInSJOZ6z234s4CCA&fallback=getapp",
    // },
    interests:
      "INTERESTS : books, brain, movies, mountains, writing, running, businesses, design, open-source, distributed systems, AI agents", 
    dislikesTitle: "pure hate",
    dislikes: "HATE: red tape, ads, bloatware, capitalism, meetings, waking up",
    linkItems: [
      { label: "github", href: social.find((s) => s.name === "GitHub")?.link ?? "#" },
      { label: "hire me", href: "/cv" },
      { label: "email", href: `mailto:${person.email}` },
    ],
  },
};

const cv: Cv = {
  path: "/cv",
  label: "CV",
  title: `CV – ${person.name}`,
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
        Builds software that actually holds up. Microservices, AI inference at scale, infra that ships.
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

const bioPage: Bio = {
  path: "/bio",
  label: "Bio",
  title: `${person.name} — harxhist`,
  description: person.name,
  intro:
    "Builder, runner, and mountain person. I enjoy systems work, simple tools, and writing notes that help me think clearly.",
  writingsTitle: "Musings",
  galleryTitle: "Gallery",
  contactTitle: "Find me",
  profile: {
    handle: "harxhist",
    tagline: person.name,
    linkedinUrl: "https://www.linkedin.com/in/harxhist",
    contactEmail: person.email,
    contactLabel: "Contact Me",
  },
};

const projects: ProjectsPage = {
  path: "/projects",
  label: "Projects",
  title: ``,
  description: `Design and dev projects by ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  /** Image list is built at build time from `public/images/gallery` — see `getGalleryImages` */
  images: [],
};

export { person, social, newsletter, home, cv, blog, bioPage, projects, gallery };
