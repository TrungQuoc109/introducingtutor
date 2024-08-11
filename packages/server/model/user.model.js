import { Model, DataTypes } from "sequelize";
import { sequelize } from "../datasourse/db.connection.js";

class User extends Model {}

User.init(
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            field: "phone_number",
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        gender: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        role: {
            type: DataTypes.INTEGER,
            defaultValue: 2,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: false,
    }
);

export { User };
