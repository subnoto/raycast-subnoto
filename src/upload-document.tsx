import { Action, ActionPanel, Form, getPreferenceValues, open, showToast, Toast, environment } from "@raycast/api";
import { readFileSync } from "fs";
import { basename, join } from "path";
import { pathToFileURL } from "url";
import { useState } from "react";

// SDK does new URL('oak_session_wasm_nodejs_bg.wasm', import.meta.url); in Raycast's bundle
// import.meta.url is undefined, so we patch URL to supply the assets path as base when base is missing.
const OriginalURL = globalThis.URL;
const wasmBase = pathToFileURL(join(environment.assetsPath, "oak_session_wasm_nodejs_bg.wasm")).href.replace(
  /[^/]+$/,
  ""
);
globalThis.URL = class PatchedURL extends OriginalURL {
  constructor(input: string | URL, base?: string | URL) {
    const isWasm =
      base === undefined &&
      (input === "oak_session_wasm_nodejs_bg.wasm" || String(input).endsWith("oak_session_wasm_nodejs_bg.wasm"));
    super(input as string, isWasm ? wasmBase : base);
  }
} as typeof URL;

interface Preferences {
  apiAccessKey: string;
  apiSecretKey: string;
}

interface FormValues {
  file: string[];
  title: string;
}

export default function Command() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: FormValues) {
    if (!values.file || values.file.length === 0) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No file selected",
        message: "Please select a PDF or Word document to upload",
      });
      return;
    }

    const filePath = values.file[0];
    const fileName = basename(filePath);
    const title = values.title || fileName.replace(/\.[^/.]+$/, "");

    // Validate file type
    const extension = filePath.toLowerCase().split(".").pop();
    if (!["pdf", "doc", "docx", "odt", "rtf"].includes(extension || "")) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Invalid file type",
        message: "Please select a PDF or Word document (.pdf, .doc, .docx, .odt, .rtf)",
      });
      return;
    }

    setIsLoading(true);

    try {
      const preferences = getPreferenceValues<Preferences>();

      const { SubnotoClient } = await import("@subnoto/api-client");
      const client = new SubnotoClient({
        apiBaseUrl: "https://enclave.subnoto.com",
        accessKey: preferences.apiAccessKey,
        secretKey: preferences.apiSecretKey,
      });

      await showToast({
        style: Toast.Style.Animated,
        title: "Connecting to Subnoto...",
      });

      // Get workspaces
      const { data: workspaceData, error: workspaceError } = await client.POST("/public/workspace/list", { body: {} });

      if (workspaceError || !workspaceData?.workspaces?.length) {
        throw new Error("Failed to fetch workspaces. Please check your API credentials.");
      }

      const workspaceUuid = workspaceData.workspaces[0].uuid;

      await showToast({
        style: Toast.Style.Animated,
        title: "Uploading document...",
      });

      // Read file and upload
      const fileBuffer = readFileSync(filePath);
      const result = await client.uploadDocument({
        workspaceUuid,
        fileBuffer,
        envelopeTitle: title,
      });

      if (!result?.envelopeUuid) {
        throw new Error("Failed to upload document. No envelope ID returned.");
      }
      if (!workspaceUuid) {
        throw new Error("No workspace UUID returned.");
      }

      const editUrl = `https://app.subnoto.com/envelopes/${workspaceUuid}/${result.envelopeUuid}/edit`;

      await showToast({
        style: Toast.Style.Success,
        title: "Document uploaded!",
        message: "Opening in browser...",
      });

      // Open the envelope edit page in the browser
      await open(editUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      await showToast({
        style: Toast.Style.Failure,
        title: "Upload failed",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Upload Document" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.FilePicker
        id="file"
        title="Document"
        allowMultipleSelection={false}
        canChooseDirectories={false}
        canChooseFiles={true}
        info="Select a PDF or Word document (.pdf, .doc, .docx) to upload. Max size: 50 MB."
      />
      <Form.TextField
        id="title"
        title="Envelope Title"
        placeholder="Leave empty to use filename"
        info="The title for the envelope in Subnoto. Defaults to the filename if left empty."
      />
    </Form>
  );
}
