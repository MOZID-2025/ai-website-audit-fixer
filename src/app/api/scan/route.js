import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { runAudit } from "../../lib/audit";
import { calculateHealthScore } from "../../lib/score";

export async function POST(request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          message: "Website URL is required.",
        },
        { status: 400 },
      );
    }

    // Validate URL
    let websiteUrl;

    try {
      websiteUrl = new URL(url);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid website URL.",
        },
        { status: 400 },
      );
    }

    if (!["http:", "https:"].includes(websiteUrl.protocol)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only HTTP and HTTPS URLs are allowed.",
        },
        { status: 400 },
      );
    }

    console.log("Scanning website:", websiteUrl.href);

    // Fetch website HTML
    let response;

    try {
      response = await fetch(websiteUrl.href, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; SiteFixAI/1.0; +https://example.com)",
        },
        redirect: "follow",
      });
    } catch (error) {
      console.error("Website fetch failed:", error);

      if (error?.cause?.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE") {
        return NextResponse.json(
          {
            success: false,
            message:
              "This website's SSL certificate could not be verified by our scanner.",
          },
          { status: 422 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not connect to this website. Please check that the website is publicly accessible.",
        },
        { status: 422 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `Website returned status ${response.status}.`,
        },
        { status: 400 },
      );
    }

    const html = await response.text();

    // Load HTML into Cheerio
    const $ = cheerio.load(html);

    // Extract basic SEO data
    const title = $("title").first().text().trim();

    const metaDescription =
      $('meta[name="description"]').attr("content")?.trim() || "";

    const h1s = $("h1")
      .map((_, element) => $(element).text().trim())
      .get();

    const images = $("img")
      .map((_, element) => ({
        src: $(element).attr("src") || "",
        alt: $(element).attr("alt") || "",
      }))
      .get();

    const links = $("a")
      .map((_, element) => ({
        text: $(element).text().trim(),
        href: $(element).attr("href") || "",
      }))
      .get();

    const canonical = $('link[rel="canonical"]').attr("href")?.trim() || "";

    const language = $("html").attr("lang") || "";

    const auditIssues = runAudit({
      seo: {
        title,
        metaDescription,
        h1Count: h1s.length,
        h1s,
        canonical,
      },

      images: {
        total: images.length,
        missingAlt: images.filter((image) => !image.alt).length,
        items: images,
      },

      links: {
        total: links.length,
        items: links,
      },

      technical: {
        language,
      },
    });

    const healthScore = calculateHealthScore(auditIssues);

    const result = {
      url: websiteUrl.href,
      statusCode: response.status,
      healthScore,

      seo: {
        title,
        metaDescription,
        h1Count: h1s.length,
        h1s,
        canonical,
      },

      images: {
        total: images.length,
        missingAlt: images.filter((image) => !image.alt).length,
        items: images,
      },

      links: {
        total: links.length,
        items: links,
      },

      technical: {
        language,
      },
      issues: auditIssues,
    };

    console.log("Scan result:", result);

    return NextResponse.json({
      success: true,
      message: "Website scanned successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Scan error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to scan this website.",
      },
      { status: 500 },
    );
  }
}
