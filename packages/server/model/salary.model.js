import { Model, DataTypes } from "sequelize";
import { sequelize } from "../datasourse/db.connection.js";

class Salary extends Model {}

Salary.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        baseSalary: {
            type: DataTypes.INTEGER,
            field: "base_salary",
            allowNull: false,
        },
        deduction: {
            type: DataTypes.INTEGER,
            defaultValue: 20,
            allowNull: false,
        },
        totalSalary: {
            type: DataTypes.INTEGER,
            field: "total_salary",
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        tutorId: {
            type: DataTypes.UUID,
            field: "tutor_id",
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Salary",
        tableName: "salary",
        timestamps: false,
    }
);

export { Salary };
