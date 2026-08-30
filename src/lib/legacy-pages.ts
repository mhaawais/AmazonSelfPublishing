import "server-only";

import fs from "node:fs";
import path from "node:path";

export const routeFiles = {
  "services.php": "services.html",
  "ghostwriting-services.php": "ghostwriting-services.html",
  "book-editing-services.php": "book-editing-services.html",
  "book-publishing-services.php": "book-publishing-services.html",
  "proofreading-services.php": "proofreading-services.html",
  "audio-book-recording-services.php": "audio-book-recording-services.html",
  "book-promotion-services.php": "book-promotion-services.html",
  "book-marketing-services.php": "book-marketing-services.html",
  "formatting-services.php": "formatting-services.html",
  "ebook-writing-services.php": "ebook-writing-services.html",
  "blog-writing-service.php": "blog-writing-service.html",
  "web-content-writing-service.php": "web-content-writing-service.html",
  "amazon-book-publishing-services.php": "amazon-book-publishing-services.html",
  "article-writing-services.php": "article-writing-services.html",
  "book-trailer-services.php": "book-trailer-services.html",
  "book-cover-design-services.php": "book-cover-design-services.html",
  "author-website-design-services.php": "author-website-design-services.html",
  "case-study.php": "case-study.html",
  "pricing.php": "pricing.html",
  "faq.php": "faq.html",
  "contact.php": "contact.html",
  "get-a-quote.php": "get-a-quote.html",
  "terms-and-conditions.php": "terms-and-conditions.html",
  "privacy-policy.php": "privacy-policy.html",
} as const;

export type LegacyPage = {
  description: string;
  html: string;
  title: string;
};

function extract(html: string, expression: RegExp) {
  return html.match(expression)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
}

function normalizeBody(html: string) {
  const bodyStartMatch = /<body[^>]*>/i.exec(html);
  const bodyStart = bodyStartMatch
    ? bodyStartMatch.index + bodyStartMatch[0].length
    : 0;
  const documentBody = html.slice(bodyStart);
  const scriptStart = documentBody.search(/<script\s+src=/i);
  const bodyEnd = documentBody.search(/<\/body>/i);
  const candidates = [scriptStart, bodyEnd].filter((index) => index >= 0);
  const end = candidates.length > 0 ? Math.min(...candidates) : documentBody.length;

  let normalized = documentBody
    .slice(0, end)
    .replace(/<\/head>/gi, "")
    .replace(/<!--\s*Mirrored from[\s\S]*?-->/gi, "")
    .replace(/href=(['"])index(?:-2)?\.html\1/gi, 'href="/"')
    .replace(/href=(['"])([^'"#:?]+)\.html([?#][^'"]*)?\1/gi, (_match, quote, route, suffix = "") =>
      `href=${quote}${route}.php${suffix}${quote}`,
    )
    .replace(
      /action=(['"])(?:https?:\/\/[^'"]+)?\/php\/send-data\.php\1/gi,
      'action="#"',
    )
    .replace(/<input[^>]+(?:id|name)=(['"])user_ip\1[^>]*>/gi, "");

  const repairedAssets: Record<string, string> = {
    "assets/img/article-writing-publication.svg": "assets/img/article-writers.png",
    "assets/img/author-website.svg": "assets/img/author-website-img.png",
    "assets/img/banner-rignt-img4.png": "assets/img/banner-rignt-img3.png",
    "assets/img/bg1.webp": "assets/img/fade-bg.png",
    "assets/img/book-cover-design.svg": "assets/img/book-cover-img.png",
    "assets/img/book-marketing.svg": "assets/img/book-marketing-img.png",
    "assets/img/book-publishing.svg": "assets/img/publishing-img.png",
    "assets/img/book-video-trailer.svg": "assets/img/book-video-trailer-img.png",
    "assets/img/custom-book-illustration.svg": "assets/img/customized-offers.png",
    "assets/img/ebook-writing.svg": "assets/img/ebook-writing-img.png",
    "assets/img/editing.svg": "assets/img/editing-img.png",
    "assets/img/ghost-book-writing.svg": "assets/img/ghost-writing-img.png",
    "assets/img/icon-check2.webp": "assets/img/appealing-design.png",
    "assets/img/professional-audio-book.svg": "assets/img/audio-book-img.png",
    "assets/img/why-choose-us.png": "assets/img/customer-oriented.png",
    "assets/img/ajax-loader.html": "assets/img/ajax-loader.gif",
    "assets/img/cta_bg.html": "assets/img/cta_bg.png",
    "assets/img/footer2_top_bg.html": "assets/img/footer2_top_bg.jpg",
    "assets/img/how-to-inner-bg.html": "assets/img/how-to-inner-bg.jpg",
    "assets/img/left-timeline-arrow.html": "assets/img/left-timeline-arrow.png",
    "assets/img/most-sold.html": "assets/img/most-sold.webp",
    "assets/img/new-image-twoo-1024x803.html": "assets/img/new-image-twoo-1024x803.png",
    "assets/img/pbef.html": "assets/img/pbef.webp",
    "assets/img/right-arrow.html": "assets/img/right-arrow.png",
    "assets/img/right-timeline-arrow.html": "assets/img/right-timeline-arrow.png",
    "assets/img/sec_cts_two.html": "assets/img/sec_cts_two.png",
    "assets/img/sec_ebooks_bg.html": "assets/img/sec_ebooks_bg.png",
    "assets/img/video-bg3.html": "assets/img/video-bg3.png",
    "assets/img/video-bg-pettern.html": "assets/img/video-bg-pettern.png",
  };

  for (let icon = 1; icon <= 9; icon++) {
    const number = String(icon).padStart(2, "0");
    repairedAssets[`assets/img/icon-${number}.html`] = `assets/img/icon-${number}.png`;
  }

  for (const [broken, repaired] of Object.entries(repairedAssets)) {
    normalized = normalized.replaceAll(broken, repaired);
  }

  return normalized.replace(/<img\b[^>]*>/gi, (imageTag) => {
    const lazySource = imageTag.match(/data-imgurl=(['"])([^'"]+)\1/i)?.[2];
    if (!lazySource) return imageTag;
    const source = lazySource.startsWith("/") ? lazySource : `/${lazySource}`;
    return imageTag.replace(/src=(['"])[^'"]*\1/i, `src="${source}"`);
  });
}

export function loadLegacyPage(fileName: string): LegacyPage {
  const filePath = path.join(process.cwd(), "content", "pages", fileName);
  const source = fs.readFileSync(filePath, "utf8");
  const description = source.match(
    /<meta\s+name=(['"])description\1\s+content=(['"])([\s\S]*?)\2\s*\/?\s*>/i,
  )?.[3];

  return {
    title: extract(source, /<title>\s*([\s\S]*?)\s*<\/title>/i) || "Home",
    description: description?.trim() ?? "",
    html: normalizeBody(source),
  };
}
