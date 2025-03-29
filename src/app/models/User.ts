import { Model, DataTypes, Sequelize } from "sequelize";
import bcrypt from "bcrypt";

interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password?: string;
  password_hash?: string;
  admin?: boolean;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password?: string;
  public password_hash?: string;
  public admin?: boolean;

  static initModel(sequelize: Sequelize): typeof User {
    User.init(
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
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.VIRTUAL,
        },
        password_hash: {
          type: DataTypes.STRING,
        },
        admin: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: "users",
      }
    );

    User.addHook("beforeSave", async (user: User) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10);
      }
    });

    return User;
  }

  public async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash || "");
  }
}

export default User;
