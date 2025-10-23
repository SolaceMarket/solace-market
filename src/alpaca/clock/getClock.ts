import { baseUrl, headers } from "@/alpaca/config";

export const clockUrl = `${baseUrl}/v1/clock`;

export const getClock = async () => {
  const clockResponse = await fetch(clockUrl, {
    method: "GET",
    headers,
  });

  const clockData = await clockResponse.json();
  console.log("clock data as json", clockData);

  return clockData;
};
