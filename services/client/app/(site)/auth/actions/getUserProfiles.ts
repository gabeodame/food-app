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

export async function updateUserProfile(
  id: string,
  data: Partial<User>
): Promise<User | null> {
  try {
    const response = await fetch(`/api/1/profile/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to update user profile");
      return null;
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
}
