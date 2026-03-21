const CLOUDINARY_CLOUD_NAME = "dqfltczlj";
const CLOUDINARY_UPLOAD_PRESET = "WolfCustoms";

export async function uploadToCloudinary(file: File) {
  const resourceType = file.type.startsWith("video/") ? "video" : "image";
  const fileData = new FormData();
  fileData.append("file", file);
  fileData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
    method: "POST",
    body: fileData,
  });

  const uploadedFile = await response.json();

  if (!response.ok || !uploadedFile.secure_url) {
    throw new Error(uploadedFile?.error?.message ?? "Cloudinary upload failed");
  }

  return uploadedFile.secure_url as string;
}
