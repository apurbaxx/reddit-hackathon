const getAvailableHints = (celebrity, currentTime = new Date()) => {
  const hoursSinceRelease = Math.floor((currentTime - new Date(celebrity.createdAt)) / (1000 * 60 * 60));
  // Always show up to 5 vague hints during the first 5 hours (index 0-4)
  if (hoursSinceRelease < 5) {
    // Only show the first (hoursSinceRelease + 1) vague hints
    return celebrity.hints.slice(0, Math.min(hoursSinceRelease + 1, 5));
  }
  // After 5 hours, start revealing more hints
  // Show all vague hints (first 5), plus (hoursSinceRelease - 4) specific hints
  const totalHintsToShow = Math.min(5 + (hoursSinceRelease - 4), celebrity.hints.length);
  return celebrity.hints.slice(0, totalHintsToShow);
};
