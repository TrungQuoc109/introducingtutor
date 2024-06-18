import { Model, DataTypes } from "sequelize";
import { sequelize } from "../datasourse/db.connection.js";

class Lesson extends Model {}
Lesson.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.TIME,
            field: "start_time",
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        teachingSubjectId: {
            type: DataTypes.UUID,
            field: "teaching_subject_id",
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Lesson",
        tableName: "lesson",
        timestamps: false,
    }
);

export { Lesson };
