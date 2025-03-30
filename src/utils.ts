export const isCommand = (message: any): boolean => {
  const firstEntity = message?.entities?.[0];
  return firstEntity?.type === "bot_command" && firstEntity.offset === 0;
};

function usernameNormalize(username: string): string {
  return username.toLowerCase().replace(/\s+/g, "");
}

export const usernameEquals = (...usernames: string[]): boolean => {
  const normalizedUsernames = usernames.map(usernameNormalize); // Normalize all usernames first
  return normalizedUsernames.every(
    (username) => username === normalizedUsernames[0]
  );
};
