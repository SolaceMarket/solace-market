export const nodeEnv = process.env.NODE_ENV;
if (nodeEnv === undefined) throw new Error("NODE_ENV is not defined");

export const isDev = nodeEnv === "development";
