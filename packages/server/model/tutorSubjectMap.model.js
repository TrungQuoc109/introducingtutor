import { Model, DataTypes } from "sequelize";
import { sequelize } from "../datasourse/db.connection.js";

class TutorSubjectMap extends Model {}

TutorSubjectMap.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        tutorId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "tutor_id",
        },
        subjectId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "subject_id",
        },
    },
    {
        sequelize,
        modelName: "TutorSubjectMap",
        tableName: "tutor_subject_map",
        timestamps: false,
    }
);

export { TutorSubjectMap };
