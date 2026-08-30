/**
 * JSON-LD builders. Pure data in, pure data out — this file imports nothing,
 * including the registry, so the schema shape stays independent of it.
 */

type SoftwareApplicationInput = {
  name: string;
  description: string;
  url: string;
};

type HowToInput = {
  name: string;
  steps: { step: string; detail: string }[];
};

type FaqInput = {
  items: { q: string; a: string }[];
};

export function softwareApplicationSchema({
  name,
  description,
  url,
}: SoftwareApplicationInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function howToSchema({ name, steps }: HowToInput) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((item, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: item.step,
      text: item.detail,
    })),
  };
}

export function faqSchema({ items }: FaqInput) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
