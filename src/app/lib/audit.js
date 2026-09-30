export function runAudit(scanData) {
  const issues = [];

  if (!scanData.seo.title) {
    issues.push({
      id: "missing-title",
      category: "SEO",
      severity: "critical",
      title: "Missing Page Title",
      description:
        "This page does not have a title tag. A clear page title helps search engines and users understand the page.",
      fixable: true,
    });
  }

  if (!scanData.seo.metaDescription) {
    issues.push({
      id: "missing-meta-description",
      category: "SEO",
      severity: "warning",
      title: "Missing Meta Description",
      description:
        "This page does not have a meta description. Adding one can help search engines understand the page content.",
      fixable: true,
    });
  }

  if (scanData.seo.h1Count === 0) {
    issues.push({
      id: "missing-h1",
      category: "SEO",
      severity: "warning",
      title: "Missing H1 Heading",
      description:
        "This page does not have an H1 heading. An H1 helps communicate the main topic of the page.",
      fixable: false,
    });
  }

  if (scanData.seo.h1Count > 1) {
    issues.push({
      id: "multiple-h1",
      category: "SEO",
      severity: "opportunity",
      title: "Multiple H1 Headings",
      description:
        "This page contains multiple H1 headings. Review the heading structure to make the page hierarchy clearer.",
      fixable: false,
    });
  }

  if (scanData.images.missingAlt > 0) {
    issues.push({
      id: "missing-image-alt",
      category: "Accessibility",
      severity: "warning",
      title: "Images Missing ALT Text",
      description: `${scanData.images.missingAlt} image(s) do not have ALT text.`,
      affectedCount: scanData.images.missingAlt,
      fixable: true,
    });
  }

  return issues;
}
