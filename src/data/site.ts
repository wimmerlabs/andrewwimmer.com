// Small bits of site content that don't have their own JSON file yet.

export const site = {
  name: 'Andrew Wimmer',
  url: 'https://andrewwimmer.com',
  description:
    'Father, husband, and medical device technology consultant for Arthrex. Building with AI on the side.',
  links: {
    linkedin: 'https://www.linkedin.com/in/andrew-r-wimmer',
    github: 'https://github.com/wimmerlabs',
    repo: 'https://github.com/wimmerlabs/andrewwimmer.com',
  },
  updated: '2026-10-24',
};

export const projects = [
  {
    name: 'andrewwimmer.com',
    blurb: 'This site, readable by people and their agents',
    url: 'https://github.com/wimmerlabs/andrewwimmer.com',
    status: null,
  },
  {
    name: 'PrefStrategy',
    blurb: "A Python optimizer for Strategy's preferred-stock lineup",
    url: null,
    status: null,
  },
  {
    name: 'Liquidity Timed Portfolio Manager',
    blurb: 'A model portfolio that shifts with market liquidity',
    url: null,
    status: 'coming soon',
  },
];

// Always shown in alphabetical order, so new ones can be added anywhere in the list.
export const interests = ['AI', 'Bitcoin', 'Boating', 'Golf', 'Investing', 'Okoboji', 'Privacy tech'].sort((a, b) =>
  a.localeCompare(b, 'en', { sensitivity: 'base' }),
);

export const contactOptions = ['Email', 'Phone', 'Signal', 'Telegram', 'Nostr', 'Resume'];
