import { RecipeUser } from "../dtos";
import { prisma } from "../utils/prisma";

class RecipeUserService {
  async createUser(data: RecipeUser) {
    const user = await prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        username: data.username,
      },
    });

    return user;
  }
}

export default new RecipeUserService();
