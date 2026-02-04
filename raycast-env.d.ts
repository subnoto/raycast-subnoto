/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** API Access Key - Your Subnoto API access key from the Subnoto dashboard */
  "apiAccessKey": string,
  /** API Secret Key - Your Subnoto API secret key from the Subnoto dashboard */
  "apiSecretKey": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `upload-document` command */
  export type UploadDocument = ExtensionPreferences & {}
  /** Preferences accessible in the `list-workspaces` command */
  export type ListWorkspaces = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `upload-document` command */
  export type UploadDocument = {}
  /** Arguments passed to the `list-workspaces` command */
  export type ListWorkspaces = {}
}

