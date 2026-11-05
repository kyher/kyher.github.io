// Site content. Edit this file to update skills, experience or projects;
// user-facing descriptions live in src/locales/*.json.

export const skills = [
  "TypeScript", "PHP", "React", "Vue", "Next.js", "Inertia.js", "Laravel",
  "Symfony", "Tailwind CSS", "AI", "HTML", "CSS", "Tanstack Start",
];

export const experience = [
  {
    company: "Komodo Digital",
    period: ["2020-02", null] as const,
    roles: [
      { title: "Senior Software Engineer", dates: ["2026-03", null] as const },
      { title: "Software Engineer", dates: ["2023-04", "2026-03"] as const },
      { title: "Software QA Engineer", dates: ["2021-04", "2023-04"] as const },
      { title: "Associate Software Quality Assurance Engineer", dates: ["2020-02", "2021-04"] as const },
    ],
  },
  {
    company: "Accenture",
    period: ["2014-09", "2020-02"] as const,
    roles: [
      { title: "Application Support Engineer", dates: ["2017-09", "2020-02"] as const },
      { title: "Associate Software Engineer", type: "apprenticeship", dates: ["2014-09", "2017-09"] as const },
    ],
  },
];

export const featured = [
  { name: "BetaReadr", descriptionKey: "betareadr", href: "https://github.com/kyher/betareadr", stack: "Laravel, Vue, Inertia, TypeScript", image: "betareadr.webp", gradient: "from-purple-600 to-fuchsia-700", highlight: true },
  { name: "Cochonnet", descriptionKey: "cochonnet", href: "https://github.com/kyher/cochonnet", stack: "Vite, React, TypeScript", image: "cochonnet.webp", gradient: "from-stone-500 to-amber-700" },
  { name: "C'est moi le chef", descriptionKey: "cest-moi-le-chef", href: "https://github.com/kyher/cest-moi-le-chef", stack: "Tanstack Start, TypeScript", image: "cestmoilechef.webp", gradient: "from-orange-500 to-red-600" },
];
