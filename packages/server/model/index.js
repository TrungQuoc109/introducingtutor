import { Document } from "./document.model.js";
import { Lesson } from "./lession.model.js";
import { Salary } from "./salary.model.js";
import { Student } from "./student.model.js";
import { StudentTeachingSubjectMap } from "./studentSubjectMap.model.js";
import { Subject } from "./subject.model.js";
import { TeachingSubject } from "./teachingSubject.model.js";
import { Tutor } from "./tutor.model.js";
import { TutorSubjectMap } from "./tutorSubjectMap.model.js";
import { User } from "./user.model.js";

Lesson.hasMany(Document, { foreignKey: "lesson_id" });
Lesson.belongsTo(TeachingSubject, { foreignKey: "teaching_subject_id" });

Document.belongsTo(Lesson, { foreignKey: "lesson_id" });
Document.belongsTo(Tutor, { foreignKey: "instructor_id" });

Salary.belongsTo(Tutor, { foreignKey: "tutor_id" });

Student.belongsTo(User, { foreignKey: "user_id" });
Student.hasMany(StudentTeachingSubjectMap, {
    foreignKey: "student_id",
});

StudentTeachingSubjectMap.belongsTo(Student, { foreignKey: "student_id" });
StudentTeachingSubjectMap.belongsTo(TeachingSubject, {
    foreignKey: "teaching_subject_id",
});

Subject.hasMany(TutorSubjectMap, { foreignKey: "subject_id" });
Subject.hasMany(TeachingSubject, { foreignKey: "subject_id" });

TeachingSubject.belongsTo(Subject, { foreignKey: "subject_id" });
TeachingSubject.hasMany(Lesson, { foreignKey: "teaching_subject_id" });
TeachingSubject.hasMany(StudentTeachingSubjectMap, {
    foreignKey: "teaching_subject_id",
});
TeachingSubject.belongsTo(Tutor, { foreignKey: "instructor_id" });

Tutor.belongsTo(User, { foreignKey: "user_id" });
Tutor.hasMany(TutorSubjectMap, { foreignKey: "tutor_id" });

TutorSubjectMap.belongsTo(Tutor, { foreignKey: "tutor_id" });
TutorSubjectMap.belongsTo(Subject, { foreignKey: "subject_id" });

User.hasOne(Tutor, { foreignKey: "user_id" });
User.hasOne(Student, { foreignKey: "user_id" });
export * from "./lession.model.js";
export * from "./document.model.js";
export * from "./otp.model.js";
export * from "./subject.model.js";
export * from "./teachingSubject.model.js";
export * from "./tutor.model.js";
export * from "./user.model.js";
export * from "./studentSubjectMap.model.js";
export * from "./salary.model.js";
export * from "./tutorSubjectMap.model.js";
export * from "./student.model.js";
