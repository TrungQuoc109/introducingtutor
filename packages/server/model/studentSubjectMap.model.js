import { DataTypes, Model } from "sequelize";
import { sequelize } from "../datasourse/db.connection.js";

class StudentTeachingSubjectMap extends Model {}
StudentTeachingSubjectMap.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        studentId: {
            type: DataTypes.UUID,
            field: "student_id",
            allowNull: false,
        },
        teachingSubjectId: {
            type: DataTypes.UUID,
            field: "teaching_subject_id",
            allowNull: false,
        },
        orderId: {
            type: DataTypes.STRING,
            field: "order_id",
            allowNull: false,
        },
        amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        transId: { type: DataTypes.STRING, field: "trans_id" },
        status: { type: DataTypes.INTEGER, defaultValue: 1 },
    },
    {
        sequelize,
        modelName: "StudentTeachingSubjectMap",
        tableName: "student_teaching_subject_map",
        timestamps: false,
    }
);

export { StudentTeachingSubjectMap };
