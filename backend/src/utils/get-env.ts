export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return defaultValue;
  }
  return value;
};

export const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined || value.trim() === "") {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
};