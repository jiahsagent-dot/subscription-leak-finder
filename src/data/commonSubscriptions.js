/**
 * 50 common Australian subscriptions — pre-loaded quick-add list
 */
export const COMMON_SUBS = [
  // Streaming Video
  { name: 'Netflix',          category: 'entertainment', amount: 22.99, frequency: 'monthly',  logo: '🎬', url: 'netflix.com' },
  { name: 'Stan',             category: 'entertainment', amount: 14.00, frequency: 'monthly',  logo: '📺', url: 'stan.com.au' },
  { name: 'Binge',            category: 'entertainment', amount: 10.00, frequency: 'monthly',  logo: '🍿', url: 'binge.com.au' },
  { name: 'Kayo Sports',      category: 'entertainment', amount: 25.00, frequency: 'monthly',  logo: '⚽', url: 'kayosports.com.au' },
  { name: 'Disney+',          category: 'entertainment', amount: 13.99, frequency: 'monthly',  logo: '✨', url: 'disneyplus.com' },
  { name: 'Amazon Prime',     category: 'entertainment', amount: 9.99,  frequency: 'monthly',  logo: '📦', url: 'amazon.com.au/prime' },
  { name: 'Paramount+',       category: 'entertainment', amount: 8.99,  frequency: 'monthly',  logo: '🎥', url: 'paramountplus.com' },
  { name: 'Apple TV+',        category: 'entertainment', amount: 12.99, frequency: 'monthly',  logo: '🍎', url: 'tv.apple.com' },
  { name: 'YouTube Premium',  category: 'entertainment', amount: 15.99, frequency: 'monthly',  logo: '▶️', url: 'youtube.com/premium' },
  { name: 'Foxtel Now',       category: 'entertainment', amount: 25.00, frequency: 'monthly',  logo: '📡', url: 'foxtel.com.au' },

  // Music
  { name: 'Spotify',          category: 'entertainment', amount: 12.99, frequency: 'monthly',  logo: '🎵', url: 'spotify.com' },
  { name: 'Apple Music',      category: 'entertainment', amount: 12.99, frequency: 'monthly',  logo: '🎶', url: 'music.apple.com' },
  { name: 'Tidal',            category: 'entertainment', amount: 11.99, frequency: 'monthly',  logo: '🌊', url: 'tidal.com' },
  { name: 'Deezer',           category: 'entertainment', amount: 11.99, frequency: 'monthly',  logo: '🎤', url: 'deezer.com' },
  { name: 'Audible',          category: 'entertainment', amount: 16.45, frequency: 'monthly',  logo: '📚', url: 'audible.com.au' },

  // Health & Fitness
  { name: 'Headspace',        category: 'health',        amount: 12.99, frequency: 'monthly',  logo: '🧘', url: 'headspace.com' },
  { name: 'Calm',             category: 'health',        amount: 14.99, frequency: 'monthly',  logo: '🌿', url: 'calm.com' },
  { name: 'MyFitnessPal',     category: 'health',        amount: 14.99, frequency: 'monthly',  logo: '💪', url: 'myfitnesspal.com' },
  { name: 'Strava',           category: 'health',        amount: 9.99,  frequency: 'monthly',  logo: '🏃', url: 'strava.com' },
  { name: 'Whoop',            category: 'health',        amount: 39.00, frequency: 'monthly',  logo: '⌚', url: 'whoop.com' },

  // Productivity & Software
  { name: 'Adobe Creative Cloud', category: 'software', amount: 89.99, frequency: 'monthly',  logo: '🎨', url: 'adobe.com' },
  { name: 'Microsoft 365',    category: 'software',      amount: 13.99, frequency: 'monthly',  logo: '💼', url: 'microsoft.com/365' },
  { name: 'Canva Pro',        category: 'software',      amount: 24.99, frequency: 'monthly',  logo: '🖌️', url: 'canva.com' },
  { name: 'Notion',           category: 'software',      amount: 16.00, frequency: 'monthly',  logo: '📝', url: 'notion.so' },
  { name: 'Dropbox Plus',     category: 'software',      amount: 16.99, frequency: 'monthly',  logo: '☁️', url: 'dropbox.com' },
  { name: 'iCloud+ 200GB',    category: 'software',      amount: 1.49,  frequency: 'monthly',  logo: '☁️', url: 'icloud.com' },
  { name: 'iCloud+ 2TB',      category: 'software',      amount: 5.99,  frequency: 'monthly',  logo: '☁️', url: 'icloud.com' },
  { name: 'Google One 200GB', category: 'software',      amount: 3.49,  frequency: 'monthly',  logo: '🔵', url: 'one.google.com' },
  { name: 'LastPass',         category: 'software',      amount: 4.50,  frequency: 'monthly',  logo: '🔐', url: 'lastpass.com' },
  { name: '1Password',        category: 'software',      amount: 5.99,  frequency: 'monthly',  logo: '🔑', url: '1password.com' },

  // News & Reading
  { name: 'The Australian',   category: 'news',          amount: 28.00, frequency: 'monthly',  logo: '📰', url: 'theaustralian.com.au' },
  { name: 'AFR',              category: 'news',          amount: 33.00, frequency: 'monthly',  logo: '📊', url: 'afr.com' },
  { name: 'SMH / Age',        category: 'news',          amount: 24.00, frequency: 'monthly',  logo: '📄', url: 'smh.com.au' },
  { name: 'Kindle Unlimited', category: 'entertainment', amount: 13.99, frequency: 'monthly',  logo: '📖', url: 'amazon.com.au/kindle' },

  // Food & Delivery
  { name: 'HelloFresh',       category: 'food',          amount: 85.00, frequency: 'monthly',  logo: '🥗', url: 'hellofresh.com.au' },
  { name: 'Marley Spoon',     category: 'food',          amount: 80.00, frequency: 'monthly',  logo: '🍽️', url: 'marleyspoon.com.au' },

  // Professional
  { name: 'LinkedIn Premium', category: 'productivity',  amount: 59.99, frequency: 'monthly',  logo: '💼', url: 'linkedin.com/premium' },
  { name: 'Xero',             category: 'productivity',  amount: 32.00, frequency: 'monthly',  logo: '💹', url: 'xero.com' },
  { name: 'Slack',            category: 'productivity',  amount: 10.50, frequency: 'monthly',  logo: '💬', url: 'slack.com' },
  { name: 'Zoom Pro',         category: 'productivity',  amount: 23.99, frequency: 'monthly',  logo: '🎯', url: 'zoom.us' },
  { name: 'Grammarly',        category: 'productivity',  amount: 14.99, frequency: 'monthly',  logo: '✍️', url: 'grammarly.com' },

  // Gaming
  { name: 'Xbox Game Pass',   category: 'entertainment', amount: 15.95, frequency: 'monthly',  logo: '🎮', url: 'xbox.com' },
  { name: 'PlayStation Plus', category: 'entertainment', amount: 13.95, frequency: 'monthly',  logo: '🕹️', url: 'playstation.com' },
  { name: 'Nintendo Switch Online', category: 'entertainment', amount: 5.99, frequency: 'monthly', logo: '🎲', url: 'nintendo.com' },

  // Utilities
  { name: 'NordVPN',          category: 'software',      amount: 7.49,  frequency: 'monthly',  logo: '🛡️', url: 'nordvpn.com' },
  { name: 'ExpressVPN',       category: 'software',      amount: 12.95, frequency: 'monthly',  logo: '🔒', url: 'expressvpn.com' },
  { name: 'Antivirus (Norton)', category: 'software',    amount: 9.99,  frequency: 'monthly',  logo: '🦠', url: 'norton.com' },
  { name: 'Dashlane',         category: 'software',      amount: 5.99,  frequency: 'monthly',  logo: '🗝️', url: 'dashlane.com' },
  { name: 'Duolingo Plus',    category: 'productivity',  amount: 9.99,  frequency: 'monthly',  logo: '🦉', url: 'duolingo.com' },
];

export const CATEGORIES = [
  { value: 'entertainment', label: 'Entertainment', color: '#6366f1', icon: '🎬' },
  { value: 'health',        label: 'Health',        color: '#22c55e', icon: '💪' },
  { value: 'software',      label: 'Software',      color: '#3b82f6', icon: '💻' },
  { value: 'productivity',  label: 'Productivity',  color: '#f59e0b', icon: '📈' },
  { value: 'food',          label: 'Food',          color: '#ef4444', icon: '🍽️' },
  { value: 'news',          label: 'News',          color: '#8b5cf6', icon: '📰' },
  { value: 'other',         label: 'Other',         color: '#6b7280', icon: '📦' },
];

export const FREQUENCIES = [
  { value: 'weekly',  label: 'Weekly',  multiplier: 52 / 12 },
  { value: 'monthly', label: 'Monthly', multiplier: 1 },
  { value: 'annual',  label: 'Annual',  multiplier: 1 / 12 },
];

/**
 * Convert any subscription amount to monthly equivalent
 */
export const toMonthly = (amount, frequency) => {
  const freq = FREQUENCIES.find((f) => f.value === frequency);
  return freq ? amount * freq.multiplier : amount;
};

/**
 * Convert monthly amount to annual
 */
export const toAnnual = (amount, frequency) => toMonthly(amount, frequency) * 12;
