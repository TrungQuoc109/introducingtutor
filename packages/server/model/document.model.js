import { DataTypes, Model } from "sequelize";
import { sequelize } from "../datasourse/db.connection.js";

class Document extends Model {}

Document.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        lessonId: {
            type: DataTypes.UUID,
            field: "lesson_id",
            allowNull: false,
        },
        instructorId: {
            type: DataTypes.UUID,
            field: "instructor_id",
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Document",
        tableName: "document",
        timestamps: false,
    }
);

export { Document };
