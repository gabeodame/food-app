type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  imageUrl: string;
};

export async function getUserProfile(email: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/1/profile/email/${email}`, {
      cache: "no-cache",
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch user profile");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
