import type { Preferences } from "./types.js";
import type { Workspace } from "./types.js";

const API_BASE_URL = "https://enclave.subnoto.com";

export async function getSubnotoClient(preferences: Preferences) {
  const { SubnotoClient } = await import("@subnoto/api-client");
  return new SubnotoClient({
    apiBaseUrl: API_BASE_URL,
    accessKey: preferences.apiAccessKey,
    secretKey: preferences.apiSecretKey,
  });
}

export async function listWorkspaces(preferences: Preferences): Promise<Workspace[]> {
  const client = await getSubnotoClient(preferences);
  const { data, error } = await client.POST("/public/workspace/list", { body: {} });

  if (error) {
    throw new Error("Failed to fetch workspaces. Please check your API credentials.");
  }

  if (!data?.workspaces?.length) {
    return [];
  }

  return data.workspaces;
}
