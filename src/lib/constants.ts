export const INDUSTRIES = [
  "Roofing",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Painting",
  "Drywall",
  "Remodeling",
  "Landscaping",
  "Concrete",
  "Flooring",
  "Dentist",
  "Attorney",
  "Chiropractor",
  "Med Spa",
  "Church",
  "Restaurant",
  "Event Planner",
  "Real Estate",
  "Insurance",
] as const;

export type Industry = (typeof INDUSTRIES)[number];

/**
 * Contractor / home-services industries get the highest-value product fits
 * (quote tools, booking, CRM). Used by the suggested-product engine.
 */
export const CONTRACTOR_INDUSTRIES: Industry[] = [
  "Roofing",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Painting",
  "Drywall",
  "Remodeling",
  "Landscaping",
  "Concrete",
  "Flooring",
];

export const SUGGESTED_PRODUCTS = {
  INSTANT_QUOTE: "Instant Quote Plugin",
  EMAIL_PLATFORM: "Email Platform",
  SOCIAL_MEDIA_OS: "Social Media OS",
  SEO_SERVICES: "SEO Services",
  BOOKING_SYSTEM: "Booking System",
} as const;

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
] as const;

export const PAGE_SIZE = 25;
