export function calculateHealthScore(issues) {
  let score = 100;

  const penalties = {
    critical: 15,
    warning: 8,
    opportunity: 3,
  };

  for (const issue of issues) {
    const penalty = penalties[issue.severity] || 0;
    score -= penalty;
  }

  return Math.max(0, score);
}
