import { getIo } from '../socket.js';
import Student from '../models/Student.js';
import { calculateProgress } from '../services/progressService.js';
import { ensureSubjectsMatchPlan } from '../services/planService.js';
import ClassPlan from '../models/ClassPlan.js';

export const getStudentWithPlan = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const plan = await ClassPlan.findOne({ classLevel: student.classLevel });
    if (!plan) return res.status(404).json({ message: "Class plan not found" });

    // Merge plan subjects with student's progress
    const mergedSubjects = plan.subjects.map(planSubj => {
      const studentSubj = student.subjects.find(s => s.name === planSubj.name) || {};
      return {
        name: planSubj.name,
        totalLectures: planSubj.totalLectures,
        lecturesSupplied: studentSubj.lecturesSupplied || 0,
        lecturesCompleted: studentSubj.lecturesCompleted || 0,
        gradeSum: studentSubj.gradeSum || 0,
        gradeCount: studentSubj.gradeCount || 0
      };
    });

    res.json({
      ...student.toObject(),
      subjects: mergedSubjects
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /students/:id/progress
 * Returns per-subject metrics + overallProgress
 */
export async function getProgress(req, res) {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send('Student not found');
  await ensureSubjectsMatchPlan(student);
  await student.save();
  const progress = calculateProgress(student.subjects || []);
  res.json({ studentId: student._id, classLevel: student.classLevel, completedClasses: student.completedClasses, ...progress });
}

/**
 * PATCH /students/:id/progress
 * Body: { subjectName, lecturesCompletedDelta, gradeReceived }
 * Increment completed lectures and append grade.
 */
export async function updateProgress(req, res) {
  try {
    const { subjectName, lecturesCompletedDelta = 0, gradeReceived, lecturesSupplied } = req.body;
    if (!subjectName || lecturesCompletedDelta < 0 || (gradeReceived != null && (gradeReceived < 0 || gradeReceived > 100))) {
      return res.status(400).send('Invalid update values');
    }

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send('Student not found');
    await ensureSubjectsMatchPlan(student);

    if (!Array.isArray(student.subjects)) {
      student.subjects = [];
    }
    let subject = student.subjects.find(s => s.name === subjectName);
    if (!subject) return res.status(400).send('Subject is not in the class plan');
    if (lecturesSupplied != null) {
      subject.lecturesSupplied = Math.max(subject.lecturesSupplied, Number(lecturesSupplied));
    }

    subject.lecturesCompleted = Math.min(
      subject.lecturesSupplied,
      Number(lecturesCompletedDelta)
    );
    if (gradeReceived != null) {
      subject.gradeSum += Number(gradeReceived);
      subject.gradeCount += 1;
    }

    await student.save();
    let { subjects, overallProgress } = calculateProgress(student.subjects);
     const allDone =
      student.subjects.length > 0 &&
      student.subjects.every(s => s.lecturesCompleted >= s.lecturesSupplied);

    if (allDone && student.classLevel < 12) {
  student.completedClasses.push({
    classLevel: student.classLevel,
    overallProgress
  });
      const nextLevel = student.classLevel + 1;
      student.classLevel = nextLevel;
      student.subjects = [];              // wipe old subjects
      await ensureSubjectsMatchPlan(student);  // seed new subjects from ClassPlan
      await student.save();

      // recalc progress for the new class (should be zeros)
      ({ subjects, overallProgress } = calculateProgress(student.subjects));
    }
    const io = getIo();
    if (student.guardianId) {
      const guardianRoom = `guardian_${student.guardianId.toString()}`;
      io.to(guardianRoom).emit('progressUpdated', {
        studentId: student._id,
        classLevel: student.classLevel,
        subjects,
        overallProgress
      });
    }
    res.json({ studentId: student._id, classLevel: student.classLevel, subjects, overallProgress });
  }
  catch (err) {
    console.error('updateProgress error:', err);
    res.status(500).send(err.message);
  }
}

/**
 * PATCH /students/:id
 * Body may contain: classLevel, subjects array (to add/update supplies)
 */
export async function updateStudent(req, res) {
  const { classLevel, subjects } = req.body;
  const student = await Student.findById(req.params.id);
  if (!student) return res.sendStatus(404);

  await ensureSubjectsMatchPlan(student);

  if (classLevel != null && classLevel !== student.classLevel) {
     const allDone =
      student.subjects.length > 0 &&
      student.subjects.every(s => s.lecturesSupplied > 0 && s.lecturesCompleted >= s.lecturesSupplied);

    if (!allDone) {
      return res.status(400).send('Cannot promote: all subjects must be fully completed for current class');
    }
    if (classLevel !== student.classLevel + 1) {
      return res.status(400).send('Promotion must advance by exactly one level');
    }
    student.classLevel = classLevel;
    student.subjects = [];
    await ensureSubjectsMatchPlan(student);
  }

  if (Array.isArray(subjects)) {
    subjects.forEach(sub => {
      let s = student.subjects.find(x => x.name === sub.name);
      if (!s) {
        // Add new subject
        student.subjects.push({
          name: sub.name,
          lecturesSupplied: sub.lecturesSupplied || 0,
          lecturesCompleted: sub.lecturesCompleted || 0,
          gradeSum: 0,
          gradeCount: 0
        });
      } else {
        // Update supplies
        s.lecturesSupplied = Math.max(s.lecturesSupplied, sub.lecturesSupplied || 0);
        // Ensure completed ≤ supplied
        s.lecturesCompleted = Math.min(s.lecturesCompleted, s.lecturesSupplied);
      }
    });
  }

  await student.save();
  res.json(student);
}
