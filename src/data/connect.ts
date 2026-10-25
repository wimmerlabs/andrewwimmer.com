// Settings for the "Looking to connect?" request flow. The /connect page,
// /llms.txt and the Worker (worker/index.ts) all read from here, so they agree.

export const contactItems = [
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'signal', label: 'Signal' },
  { key: 'telegram', label: 'Telegram' },
  { key: 'nostr', label: 'Nostr' },
  { key: 'resume', label: 'Resume' },
] as const;

export type ContactKey = (typeof contactItems)[number]['key'];

export const connect = {
  // How long an approved status link keeps working.
  linkDays: 14,
  // Requests (and everything about them) are deleted after this many days.
  keepDays: 90,
  // Spam limits: requests from one network per hour, and site-wide per day.
  perHour: 3,
  perDay: 25,
  // How many times an approved person can download the resume.
  maxDownloads: 5,
  // Longest accepted value for each field (characters).
  max: { name: 100, email: 200, company: 120, link: 200, note: 1000, agent: 100 },
};
