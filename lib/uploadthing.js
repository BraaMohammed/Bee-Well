import { generateReactHelpers } from "@uploadthing/react/hooks";
import { generateUploadButton } from "@uploadthing/react";

export const { uploadFiles } = generateReactHelpers();
export const UploadButton = generateUploadButton();
