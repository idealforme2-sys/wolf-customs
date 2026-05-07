interface QuoteLike {
  name?: string | null;
}

const PLACEHOLDER_QUOTE_NAME_PATTERN = /^test user(?:\s+\d+)?$/i;

export function isPlaceholderQuote(quote: QuoteLike) {
  const normalizedName = quote.name?.trim();
  if (!normalizedName) {
    return false;
  }

  return PLACEHOLDER_QUOTE_NAME_PATTERN.test(normalizedName);
}
