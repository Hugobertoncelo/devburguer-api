import Sequelize, { Model } from "sequelize";

class Product extends Model {
  static init(sequelize: Sequelize.Sequelize): void {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        category: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3000/product-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );
  }
}

export default Product;
