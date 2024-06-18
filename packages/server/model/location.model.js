import { Model, DataTypes } from "sequelize";
import { sequelize } from "../datasourse/db.connection.js";

class Location extends Model {}

Location.init(
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
        tutorId: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: "tutor_id",
        },
        districtsId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: "districts_id",
        },
    },
    {
        sequelize,
        modelName: "Location",
        tableName: "location",
        timestamps: false,
    }
);

export { Location };
