import { Model, DataTypes } from "sequelize";
import { sequelize } from "../datasourse/db.connection.js";

class Tutor extends Model {}

Tutor.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        education: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        experience: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "user_id",
        },
    },
    {
        sequelize,
        modelName: "Tutor",
        tableName: "tutor",
        timestamps: false,
    }
);

export { Tutor };
