import { DataTypes, Model } from "sequelize";
import { sequelize } from "../datasourse/db.connection.js";

class Otp extends Model {}

Otp.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,

            allowNull: false,
        },
        createAt: {
            type: DataTypes.DATE,
            field: "create_at",

            // allowNull: false,
            //  defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "Otp",
        tableName: "otp",
        timestamps: false,
    }
);

export { Otp };
