import {
  DataTypes,
  Model,
} from 'sequelize';

import sequelize from '../connection/connection.js';

class Datos extends Model {}
Datos.init(
    {
        Nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fecha_nacimiento: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        genero: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        estado_animo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        numero_suerte: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Datos',
        timestamps: false,
    }
);

export { Datos };