import { Sequelize, Model, DataTypes } from 'sequelize';

interface CategoryAttributes {
  id: number;
  name: string;
  path: string;
  url: string;
}
// @ts-ignore
class Category extends Model<CategoryAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public path!: string;
  public url!: string;

  static init(sequelize: Sequelize): typeof Category {
    super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        path: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        url: {
          type: DataTypes.VIRTUAL,
          get(this: Category) {
            return `http://localhost:3000/category-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'categories', // optional: specify table name
      }
    );
    return Category;
  }
}

export default Category;
