interface QuoteLike {
  name?: string | null;
}

const PLACEHOLDER_QUOTE_NAME_PATTERN = /^test(?:\s+[a-z0-9]+)*$/i;

export function isPlaceholderQuote(quote: QuoteLike) {
  const normalizedName = quote.name?.trim();
  if (!normalizedName) {
    return false;
  }

  return PLACEHOLDER_QUOTE_NAME_PATTERN.test(normalizedName);
}
