import { v4 } from "uuid";
import * as Yup from "yup";

import User from "../models/User";

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      admin: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return response.status(400).json({ error: err.errors });
      }
      return response.status(500).json({ error: "Internal server error" });
    }

    const { name, email, password, admin } = request.body;

    const userExists = await User.findOne({
      where: {
        email,
      },
    });

    if (userExists) {
      return response.status(400).json({ error: "User already exists" });
    }

    console.log(userExists);

    const user = await User.create({
      // @ts-ignore
      id: v4(),
      name,
      email,
      password,
      admin,
    });
    return response.status(201).json({
      id: user.id,
      name,
      email,
      admin,
    });
  }
}

export default new UserController();
