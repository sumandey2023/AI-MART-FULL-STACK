import { ENV } from "../config/env.js";
import ImageKit from "imagekit";
import { v4 as uuidv4 } from "uuid";

interface UploadImageInput {
  buffer: Buffer;
  folder?: string;
}

interface UploadImageResponse {
  url: string;
  thumbnail: string;
  id: string;
}

const imagekit = new ImageKit({
  publicKey: ENV.IMAGEKIT_PUBLIC_KEY,
  privateKey: ENV.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: ENV.IMAGEKIT_URL_ENDPOINT,
});

async function uploadImage({
  buffer,
  folder = "/AIMart/products",
}: UploadImageInput): Promise<UploadImageResponse> {
  const res = await imagekit.upload({
    file: buffer,
    fileName: uuidv4(),
    folder,
  });

  return {
    url: res.url,
    thumbnail: res.thumbnailUrl ?? res.url,
    id: res.fileId,
  };
}

export { uploadImage };
