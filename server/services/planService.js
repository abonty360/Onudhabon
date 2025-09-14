// services/planService.js
import ClassPlan from '../models/ClassPlan.js';

export async function ensureSubjectsMatchPlan(student) {
  const plan = await ClassPlan.findOne({ classLevel: student.classLevel });
  if (!plan) return student; // or throw new Error('Missing class plan')

  if (!Array.isArray(student.subjects)) student.subjects = [];

  const byName = new Map(student.subjects.map(s => [s.name, s]));
  for (const p of plan.subjects) {
    const existing = byName.get(p.name);
    if (!existing) {
      student.subjects.push({
        name: p.name,
        lecturesSupplied: p.totalLectures, // or 0 if you prefer to grow supply gradually
        lecturesCompleted: 0,
        gradeSum: 0,
        gradeCount: 0
      });
    } else {
      existing.lecturesSupplied = Math.max(existing.lecturesSupplied, p.totalLectures);
      existing.lecturesCompleted = Math.min(existing.lecturesCompleted, existing.lecturesSupplied);
    }
  }

  student.markModified('subjects');
  return student;
}
