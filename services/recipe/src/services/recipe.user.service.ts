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

  async handleDeadLetter(data: any): Promise<void> {
    // Logic to handle dead-lettered messages
    console.log("Handling dead-lettered ingredient message:", data);
    await this.createUser(data);

    console.log("User created from dead-lettered message.");
  }
}

export default new RecipeUserService();
