import { useStore } from "./appState";

export const getNickname = (email: string, loadedUsers: Record<string, string>) => {
  if (loadedUsers[email]) {
    return loadedUsers[email];
  }
  
  return false;
};

// Example usage
const loadedUsers = {
  "example@example.com": "JohnDoe",
  "another@example.com": "JaneSmith",
};

const nickname = getNickname("example@example.com", loadedUsers);
console.log(nickname); // Output: "JohnDoe"