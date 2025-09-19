/**
 * Calculate per-subject and overall progress.
 * - completionRatio = lecturesCompleted / lecturesSupplied
 * - avgGrade = gradeSum / gradeCount
 * - subjectProgress = completionRatio * (avgGrade / 100) * 100
 * - overallProgress = weighted average by lecturesSupplied
 */
export function calculateProgress(subjects) {
  const processed = subjects.map(subj => {
    const { lecturesSupplied, lecturesCompleted, gradeSum, gradeCount } = subj;
    if (lecturesSupplied === 0) {
      return { ...subj.toObject(), completionRatio: 0, avgGrade: 0, subjectProgress: 0 };
    }
    const completionRatio = lecturesCompleted / lecturesSupplied;
    const avgGrade = gradeCount > 0 ? gradeSum / gradeCount : 0;
    const subjectProgress = completionRatio * (avgGrade / 100) * 100;
    return { ...subj.toObject(), completionRatio, avgGrade, subjectProgress };
  });

  const totalLectures = processed.reduce((sum, s) => sum + s.lecturesSupplied, 0);
  const overallProgress = totalLectures > 0
    ? processed.reduce((acc, s) => acc + s.subjectProgress * s.lecturesSupplied, 0) / totalLectures
    : 0;

  return { subjects: processed, overallProgress };
}
