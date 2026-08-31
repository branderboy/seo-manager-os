// Dependency-free boundary validation used by the static demo.
// Production backlog replaces these helpers with Zod schemas once Zod is
// installed and locked in package-lock.json. Keeping validation centralized
// now prevents UI components from becoming the long-term validation layer.

export type ValidationResult<T> =
  | { success: true; data: T; errors: [] }
  | { success: false; data?: undefined; errors: string[] };

export type CampaignOnboardingInput = {
  legalName: string;
  brandName: string;
  website?: string;
  industry: string;
  businessModel: "storefront" | "service_area" | "hybrid";
  primaryContact: string;
  email: string;
  phone?: string;
  timezone: string;
  startDate: string;
  coreServices: string[];
  primaryCity: string;
  baselineDate: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function validateCampaignOnboarding(value: unknown): ValidationResult<CampaignOnboardingInput> {
  if (!isRecord(value)) return { success: false, errors: ["Campaign payload must be an object."] };

  const errors: string[] = [];
  const requiredStrings = ["legalName", "brandName", "industry", "primaryContact", "email", "timezone", "startDate", "primaryCity", "baselineDate"] as const;
  for (const key of requiredStrings) {
    if (typeof value[key] !== "string" || !String(value[key]).trim()) errors.push(`${key} is required.`);
  }

  if (typeof value.email === "string" && !emailPattern.test(value.email)) errors.push("email must be valid.");
  if (typeof value.startDate === "string" && !isoDatePattern.test(value.startDate)) errors.push("startDate must use YYYY-MM-DD.");
  if (typeof value.baselineDate === "string" && !isoDatePattern.test(value.baselineDate)) errors.push("baselineDate must use YYYY-MM-DD.");

  const models = new Set(["storefront", "service_area", "hybrid"]);
  if (typeof value.businessModel !== "string" || !models.has(value.businessModel)) errors.push("businessModel is invalid.");

  if (!Array.isArray(value.coreServices) || value.coreServices.filter((item) => typeof item === "string" && item.trim()).length === 0) {
    errors.push("At least one core service is required.");
  }

  if (value.website != null && typeof value.website !== "string") errors.push("website must be a string.");
  if (value.phone != null && typeof value.phone !== "string") errors.push("phone must be a string.");

  if (errors.length) return { success: false, errors };
  return { success: true, data: value as CampaignOnboardingInput, errors: [] };
}

export type KeywordCsvRow = {
  keyword: string;
  cluster?: string;
  intent?: string;
  targetCity?: string;
  targetUrl?: string;
  searchVolume?: number;
  difficulty?: number;
  cpc?: number;
};

export function validateKeywordCsvRows(rows: unknown[]): ValidationResult<KeywordCsvRow[]> {
  const errors: string[] = [];
  const parsed: KeywordCsvRow[] = [];

  rows.forEach((row, index) => {
    if (!isRecord(row) || typeof row.keyword !== "string" || !row.keyword.trim()) {
      errors.push(`Row ${index + 1}: keyword is required.`);
      return;
    }

    for (const numericKey of ["searchVolume", "difficulty", "cpc"] as const) {
      const raw = row[numericKey];
      if (raw != null && raw !== "" && Number.isNaN(Number(raw))) errors.push(`Row ${index + 1}: ${numericKey} must be numeric.`);
    }

    parsed.push({
      keyword: row.keyword.trim(),
      cluster: optionalString(row.cluster),
      intent: optionalString(row.intent),
      targetCity: optionalString(row.targetCity),
      targetUrl: optionalString(row.targetUrl),
      searchVolume: optionalNumber(row.searchVolume),
      difficulty: optionalNumber(row.difficulty),
      cpc: optionalNumber(row.cpc),
    });
  });

  return errors.length ? { success: false, errors } : { success: true, data: parsed, errors: [] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalNumber(value: unknown) {
  if (value == null || value === "") return undefined;
  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
}
