import api from "../index.js";
import { ENDPOINTS } from "../endpoints.js";
import MediaLibrary from "@models/medialibrary.js";
import BaseService from "./base.service.js";

class MediaLibraryService extends BaseService {
  constructor() {
    super(ENDPOINTS.MEDIA_LIBRARY.BASE);
  }

  async getMediaLibrary({
    page = 1,
    search = "",
    sortBy = "createdAt",
    order = "DESC",
  } = {}) {
    try {
      const response = await api.get(ENDPOINTS.MEDIA_LIBRARY.BASE, {
        params: { page, search, sortBy, order },
      });
      const mediaItems = (response.data.data || []).map((item) => {
        return MediaLibrary.fromApiResponse(item);
      });
      return {
        data: mediaItems,
        pagination: response.data.pagination || {},
      };
    } catch (error) {
      console.error("Error fetching media library:", error);
      throw error;
    }
  }

  async getMediaItemById(id) {
    try {
      const response = await api.get(ENDPOINTS.MEDIA_LIBRARY.BY_ID(id));
      return MediaLibrary.fromApiResponse(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching media item:", error);
      throw error;
    }
  }

  async uploadMedia(file, altText = "") {
    try {
      const formData = new FormData();
      formData.append("image", file);

      if (altText) {
        formData.append("altText", altText);
      }

      const response = await api.post(
        ENDPOINTS.MEDIA_LIBRARY.UPLOAD,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      return MediaLibrary.fromApiResponse(response.data.data);
    } catch (error) {
      console.error("Error uploading media item:", error);
      throw error;
    }
  }

  async uploadMultipleMedia(files, onProgress = null) {
    try {
      console.log("📤 Starting upload...");
      console.log("Files to upload:", files);

      const formData = new FormData();
      files.forEach((file) => {
        console.log("Appending file:", file.name, file.size, file.type);
        formData.append("images", file); // Giữ nguyên "images" vì Postman work
      });

      // Log FormData content
      for (let pair of formData.entries()) {
        console.log("FormData:", pair[0], pair[1]);
      }

      const response = await api.post(
        ENDPOINTS.MEDIA_LIBRARY.UPLOAD_MULTIPLE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              console.log("Upload progress:", percentCompleted + "%");
              onProgress(percentCompleted);
            }
          },
        },
      );

      console.log("Upload success:", response.data);

      const uploadedItems = (response.data.data || []).map((item) => {
        return MediaLibrary.fromApiResponse(item);
      });

      return {
        items: uploadedItems,
        summary: response.data.summary,
        errors: response.data.errors || [],
      };
    } catch (error) {
      console.error("❌ Upload error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);
      throw error;
    }
  }
  async incrementUsageCount(file_url) {
    try {
      await api.post(ENDPOINTS.MEDIA_LIBRARY.INCREMENT_USAGE, { file_url });
    } catch (error) {
      console.warn("⚠️ Failed to increment usage count:", error);
    }
  }
  async deleteMedia(id) {
    try {
      await api.delete(ENDPOINTS.MEDIA_LIBRARY.BY_ID(id));
    } catch (error) {
      console.error("Error deleting media:", error);
      throw error;
    }
  }
}

export default new MediaLibraryService();
