import ClassPlan from '../models/ClassPlan.js';

export async function ensureSubjectsMatchPlan(student) {
  const plan = await ClassPlan.findOne({ classLevel: student.classLevel });
  if (!plan) throw new Error(`Class plan not found for class level ${student.classLevel}`);

  if (!Array.isArray(student.subjects)) student.subjects = [];

  const byName = new Map(student.subjects.map(s => [s.name, s]));
  for (const p of plan.subjects) {
    const existing = byName.get(p.name);
    if (!existing) {
      student.subjects.push({
        name: p.name,
        totalLectures: p.totalLectures,
        lecturesSupplied: p.totalLectures, 
        lecturesCompleted: 0,
        gradeSum: 0,
        gradeCount: 0
      });
    } else {
      existing.totalLectures = p.totalLectures;
      existing.lecturesSupplied = Math.max(existing.lecturesSupplied, p.totalLectures);
      existing.lecturesCompleted = Math.min(existing.lecturesCompleted, existing.lecturesSupplied);
    }
  }

  student.markModified('subjects');
  return student;
}
