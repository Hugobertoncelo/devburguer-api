import { Model, DataTypes, Sequelize } from "sequelize";

interface ProductAttributes {
  id?: number;
  name: string;
  price: number;
  path: string;
  offer?: boolean;
  url?: string;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public price!: number;
  public path!: string;
  public offer?: boolean;
  public url?: string;

  static initModel(sequelize: Sequelize): typeof Product {
    Product.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        path: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        offer: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        url: {
          type: DataTypes.VIRTUAL,
          get(this: Product) {
            return `http://localhost:3000/product-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: "products",
      }
    );

    return Product;
  }

  static associate(models: any) {
    this.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
  }
}

export default Product;
