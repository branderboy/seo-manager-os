import type { SiteSnapshot } from "./site-fetcher";
import type { WordPressResult } from "./wordpress-detection";

export type TechnologyResult = {
  wordpress: boolean;
  elementor: boolean;
  wpforms: boolean;
  gravityForms: boolean;
  contactForm7: boolean;
  woocommerce: boolean;
  rankMath: boolean;
  yoast: boolean;
  bookingSystem: boolean;
  quoteSystem: boolean;
};

/** Fingerprint => any-of HTML/header substrings (all lowercased). */
const FINGERPRINTS: Record<keyof Omit<TechnologyResult, "wordpress">, string[]> = {
  elementor: ["/elementor/", "elementor-frontend", "elementor-page", "data-elementor"],
  wpforms: ["wpforms", "wpforms-container", "/wpforms/"],
  gravityForms: ["gform_wrapper", "gravity_form", "gravityforms", "gform-"],
  contactForm7: ["wpcf7", "contact-form-7", "/contact-form-7/"],
  woocommerce: ["woocommerce", "/wc-ajax/", "wc-block", "add-to-cart"],
  rankMath: ["rank-math", "rankmath", "rank_math"],
  yoast: ["yoast", "yoast_wpseo", "/wordpress-seo/"],
  bookingSystem: [
    "calendly",
    "acuityscheduling",
    "bookingpress",
    "amelia",
    "simply-schedule",
    "book-now",
    "schedule-appointment",
    "setmore",
    "bookly",
  ],
  quoteSystem: [
    "instant-quote",
    "get-a-quote",
    "request-a-quote",
    "free-estimate",
    "quote-calculator",
    "instant-estimate",
    "cost-calculator",
    "price-estimate",
  ],
};

export function detectTechnologies(
  snapshot: SiteSnapshot,
  wp: WordPressResult,
): TechnologyResult {
  const haystack = `${snapshot.html}\n${snapshot.headers}`;
  const match = (needles: string[]) => needles.some((n) => haystack.includes(n));

  return {
    wordpress: wp.detected,
    elementor: match(FINGERPRINTS.elementor),
    wpforms: match(FINGERPRINTS.wpforms),
    gravityForms: match(FINGERPRINTS.gravityForms),
    contactForm7: match(FINGERPRINTS.contactForm7),
    woocommerce: match(FINGERPRINTS.woocommerce),
    rankMath: match(FINGERPRINTS.rankMath),
    yoast: match(FINGERPRINTS.yoast),
    bookingSystem: match(FINGERPRINTS.bookingSystem),
    quoteSystem: match(FINGERPRINTS.quoteSystem),
  };
}
