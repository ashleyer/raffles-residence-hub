/* Lightweight, dependency-free password scoring used by the reset flow. */

export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

export interface PasswordStrength {
  score: StrengthLevel;
  label: string;
  /** Short, actionable suggestions for making the password stronger. */
  suggestions: string[];
}

const COMMON = [
  "password",
  "12345678",
  "qwerty",
  "letmein",
  "welcome",
  "raffles",
  "boston",
  "iloveyou",
];

const LABELS = ["Too weak", "Weak", "Fair", "Strong", "Very strong"] as const;

export function scorePassword(value: string): PasswordStrength {
  const password = value ?? "";
  const suggestions: string[] = [];

  if (!password) {
    return { score: 0, label: LABELS[0], suggestions: ["Choose at least eight characters."] };
  }

  const lower = password.toLowerCase();
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const variety = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
  const isCommon = COMMON.some((word) => lower.includes(word));
  const isRepetitive = /^(.)\1+$/.test(password) || /(.)\1{3,}/.test(password);

  let points = 0;
  if (password.length >= 8) points += 1;
  if (password.length >= 12) points += 1;
  if (password.length >= 16) points += 1;
  if (variety >= 2) points += 1;
  if (variety >= 3) points += 1;
  if (variety === 4) points += 1;
  if (isCommon) points -= 2;
  if (isRepetitive) points -= 1;

  if (password.length < 8) suggestions.push("Use at least eight characters.");
  else if (password.length < 12) suggestions.push("Longer passphrases are much harder to guess.");
  if (!hasUpper || !hasLower) suggestions.push("Mix upper and lower case letters.");
  if (!hasDigit) suggestions.push("Add a number.");
  if (!hasSymbol) suggestions.push("Add a symbol such as ! or ?.");
  if (isCommon) suggestions.push("Avoid common words like “password” or “raffles”.");
  if (isRepetitive) suggestions.push("Avoid repeated characters.");

  const score = Math.max(0, Math.min(4, points)) as StrengthLevel;
  return { score, label: LABELS[score], suggestions: suggestions.slice(0, 3) };
}
