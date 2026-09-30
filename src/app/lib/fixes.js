export function getFixForIssue(issueId) {
  const fixes = {
    "missing-image-alt": {
      issueId: "missing-image-alt",
      fixType: "ai",
      safe: true,
      requiresReview: true,
      title: "Generate ALT Text",
      description:
        "Generate descriptive ALT text for images that are missing ALT attributes.",
    },

    "missing-meta-description": {
      issueId: "missing-meta-description",
      fixType: "ai",
      safe: true,
      requiresReview: true,
      title: "Generate Meta Description",
      description:
        "Generate a relevant meta description based on the page content.",
    },

    "missing-title": {
      issueId: "missing-title",
      fixType: "ai",
      safe: true,
      requiresReview: true,
      title: "Generate Page Title",
      description:
        "Generate an SEO-friendly page title based on the page content.",
    },
  };

  return fixes[issueId] || null;
}
