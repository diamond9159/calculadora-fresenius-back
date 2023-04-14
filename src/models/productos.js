const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productos', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    presentacionGr: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rendimientoPorciones: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    tamanoPorcion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    porcionLiquida: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidadProteinaPorPorcion: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    caloriasPorPorcion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CaloriasPorMl: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    ProteinaPorMl: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    suministro: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    TipoEnvase: {
      type: DataTypes.STRING(100),
      allowNull: true
    }, 
    categoria: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'productos',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
