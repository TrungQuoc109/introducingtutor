import { DataTypes, Model } from "sequelize";
import { sequelize } from "../datasourse/db.connection.js";

class Student extends Model {}

Student.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        gradeLevel: {
            type: DataTypes.INTEGER,
            field: "grade_level",
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            field: "user_id",
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Student",
        tableName: "student",
        timestamps: false,
    }
);

export { Student };
