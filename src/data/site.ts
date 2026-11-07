// Small bits of site content that don't have their own JSON file yet.

import { execSync } from 'node:child_process';
import { contactItems } from './connect';

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
  updated: lastUpdated(),
};

// The footer's "Updated" date: the day of the latest commit, read from git at build
// time, so it moves on its own whenever a change goes live. Shown in Central time.
// Falls back to the build day if git isn't available.
function lastUpdated(): string {
  let when = new Date();
  try {
    const seconds = Number(execSync('git log -1 --format=%ct', { encoding: 'utf8' }).trim());
    if (seconds > 0) when = new Date(seconds * 1000);
  } catch {
    // No git history in this build: keep the build day.
  }
  return when.toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
}

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
export const interests = ['AI', 'Boating', 'Golf', 'Investing', 'Okoboji', 'Privacy tech'].sort((a, b) =>
  a.localeCompare(b, 'en', { sensitivity: 'base' }),
);

export const contactOptions = contactItems.map((i) => i.label);
