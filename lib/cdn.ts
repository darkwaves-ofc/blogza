"use server";
import axios from "axios";

import { Clodynix } from "clodynix";

const clodynix = new Clodynix({
  apiKey: process.env.ClodynixToken || "",
  secret: process.env.ClodynixSecret || "",
  origin: process.env.CDN_ORIGIN_LINK || "",
});

// Helper to get Authorization token from environment variables
// const getAuthToken = () => process.env.APP_SECRET;
// const getOriginLink = () => process.env.CDN_ORIGIN_LINK;
// Separated Functions
export type cdnToken = {
  token: string;
  name: string;
  extention: string;
  size: number;
  totalChunks: number;
  id: string;
  createdAt: Date;
  uses: Date[];
  finished: boolean;
};
export type cdnFileType = {
  uploadToken: cdnToken;
  id: string;
  registerdAt: Date | null;
  uploadedAt: number | undefined;
  createdAt: number;
  name: string | null;
  extension: string | null;
  updatedAt: number;
  size: number | null;
};

/**
 * Checks the information for a file stored in the CDN.
 *
 * @param fileId - The ID of the file to check.
 * @param token - An optional token associated with the file.
 * @returns The file information, or `null` if the file could not be found.
 */
export const checkFileInfo = async (
  fileId?: string,
  token?: string
): Promise<cdnFileType | null> => {
  try {
    const res = await clodynix.checkFileInfo(fileId, token);
    if (!res) {
      throw new Error("check file info error!");
    }
    return res;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
/**
 * Registers a file with the CDN.
 *
 * @param token - The token associated with the file to be registered.
 * @returns The registered file information, or `null` if the file could not be registered.
 */
export const registerFile = async (
  token: string
): Promise<cdnFileType | null> => {
  try {
    const res = await clodynix.registerFile(token);
    if (!res) {
      throw new Error("check file info error!");
    }
    return res;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
/**
 * Uploads a file to the CDN by providing a link to the file.
 *
 * @param link - The URL of the file to be uploaded.
 * @returns The uploaded file information, or `null` if the upload failed.
 */
export const uploadByLink = async (
  link: string
): Promise<cdnFileType | null> => {
  try {
    const res = await clodynix.uploadByLink(link);
    if (!res) {
      throw new Error("check file info error!");
    }
    return res;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};

/**
 * Registers a file with the CDN.
 *
 * @param token - The token associated with the file to be registered.
 * @returns The registered file information, or `null` if the file could not be registered.
 */
export const createUploadToken = async (
  totalChunks: number,
  fileData: { name: string; size: number; extension: string }
): Promise<cdnToken> => {
  try {
    const res = await clodynix.createUploadToken(totalChunks, fileData);
    if (!res) {
      throw new Error("check file info error!");
    }
    return res;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Deletes a file from the CDN.
 *
 * @param fileId - The ID of the file to be deleted.
 * @returns The ID of the deleted file.
 */
export const deleteFile = async (fileId: string): Promise<string> => {
  try {
    const res = await clodynix.deleteFile(fileId);
    if (!res) {
      throw new Error("check file info error!");
    }
    return res;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Generates a single file link on the CDN.
 *
 * @param fileId - The ID of the file to generate a link for.
 * @returns The generated file link.
 */
export const generateLink = async (fileId: string): Promise<string> => {
  try {
    const res = await clodynix.generateLink(fileId);
    if (!res) {
      throw new Error("check file info error!");
    }
    return res;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
/**
 * Generates a batch of file links on the CDN.
 *
 * @param fileIds - An array of file IDs to generate links for.
 * @returns An array of objects containing the file ID and generated link.
 */
export const generateLinksBatch = async (
  fileIds: string[]
): Promise<{ id: string; link: string }[]> => {
  try {
    const res = await clodynix.generateLinksBatch(fileIds);
    if (!res) {
      throw new Error("check file info error!");
    }
    return res;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
/**
 * Uploads a file directly to the CDN.
 *
 * @param formdata - The form data containing the file to upload.
 * @returns The uploaded file data, or `null` if the upload failed.
 */
export const uploadDirect = async (
  formdata: FormData
): Promise<cdnFileType | null> => {
  try {
    const res = await clodynix.uploadDirect(formdata);
    if (!res) {
      throw new Error("check file info error!");
    }
    return res;
  } catch (error: any) {
    console.error("Upload error:", error);
    throw new Error(error.message);
  }
};

// Need a image replace

// CDN Class

export const getFilesByids = async (ids: string[]) => {
  try {
    const res = await generateLinksBatch(ids);
    if (!res) {
      throw new Error("check file info error!");
    }
    return res;
  } catch (error: any) {
    throw new Error(error.message);
  }
};