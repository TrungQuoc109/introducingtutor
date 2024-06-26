import { Model, DataTypes } from "sequelize";
import { sequelize } from "../datasourse/db.connection.js";

class TeachingSubject extends Model {}

TeachingSubject.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        instructorId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "instructor_id",
        },
        subjectId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "subject_id",
        },
        gradeLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "grade_level",
        },
        description: {
            type: DataTypes.TEXT,
        },
        startDate: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            field: "start_date",
        },
        numberOfSessions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "number_of_sessions",
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "location_id",
        },
        specificAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "specific_address",
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        studentCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "student_count",
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "TeachingSubject",
        tableName: "teaching_subject",
        timestamps: false,
    }
);

export { TeachingSubject };
