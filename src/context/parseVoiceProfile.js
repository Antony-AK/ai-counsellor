export function parseVoice(text) {
  const t = text.toLowerCase();

  return {
    intendedDegree: t.includes("master") ? "Master's" :
      t.includes("bachelor") ? "Bachelor's" : "",

    fieldOfStudy:
      t.includes("computer") ? "Computer Science" :
      t.includes("it") ? "IT" :
      t.includes("data") ? "Data Science" : "",

    targetIntake:
      t.includes("fall 2025") ? "Fall 2025" :
      t.includes("spring 2026") ? "Spring 2026" : "",

    preferredCountries: [
      t.includes("usa") && "USA",
      t.includes("germany") && "Germany",
      t.includes("canada") && "Canada",
      t.includes("australia") && "Australia"
    ].filter(Boolean),

    budgetRange:
      t.includes("under 20") ? "Under $20K" :
      t.includes("40") ? "$20K - $40K" : "",

    ieltsStatus:
      t.includes("ielts completed") ? "Completed" :
      t.includes("ielts") ? "In Progress" : "",

    sopStatus:
      t.includes("sop not started") ? "Not Started" :
      t.includes("sop completed") ? "Completed" : ""
  };
}
