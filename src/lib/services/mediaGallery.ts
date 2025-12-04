import { writable, derived } from "svelte/store";

// Media gallery types
export interface MediaItem {
  id: number;
  title: string;
  description?: string;
  file_path: string;
  file_type: "image" | "video";
  file_size: number;
  thumbnail_path?: string;
  tags?: string;
  is_featured: boolean;
  is_public: boolean;
  uploaded_by: number;
  uploaded_at: string;
  views?: number;
  likes?: number;
}

export interface MediaAlbum {
  id: string;
  name: string;
  description: string;
  cover_image?: string;
  media_count: number;
  created_at: string;
  is_public: boolean;
}

export interface SocialPost {
  id: number;
  platform: "facebook" | "twitter" | "instagram" | "linkedin";
  content: string;
  media_id?: number;
  post_url?: string;
  status: "draft" | "scheduled" | "posted" | "failed";
  scheduled_for?: string;
  posted_at?: string;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
    reach: number;
  };
  created_by: number;
  created_at: string;
}

export interface MediaUploadConfig {
  maxFileSize: number; // bytes
  allowedTypes: string[];
  autoGenerateThumbnails: boolean;
  compressImages: boolean;
  watermarkImages: boolean;
}

// Default media configuration
export const defaultMediaConfig: MediaUploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/webm",
  ],
  autoGenerateThumbnails: true,
  compressImages: true,
  watermarkImages: true,
};

// Default albums
export const defaultAlbums: MediaAlbum[] = [
  {
    id: "tournament-day",
    name: "Tournament Day",
    description: "Action shots and moments from the tournament",
    media_count: 0,
    created_at: new Date().toISOString(),
    is_public: true,
  },
  {
    id: "registration",
    name: "Registration & Check-in",
    description: "Registration desk and player check-in photos",
    media_count: 0,
    created_at: new Date().toISOString(),
    is_public: true,
  },
  {
    id: "sponsors",
    name: "Sponsor Recognition",
    description: "Sponsor logos, banners, and recognition moments",
    media_count: 0,
    created_at: new Date().toISOString(),
    is_public: true,
  },
  {
    id: "awards",
    name: "Awards Ceremony",
    description: "Winners, prizes, and awards ceremony",
    media_count: 0,
    created_at: new Date().toISOString(),
    is_public: true,
  },
  {
    id: "behind-scenes",
    name: "Behind the Scenes",
    description: "Setup, volunteers, and behind-the-scenes moments",
    media_count: 0,
    created_at: new Date().toISOString(),
    is_public: false,
  },
];

// Media gallery store
export const mediaGallery = writable<{
  media: MediaItem[];
  albums: MediaAlbum[];
  socialPosts: SocialPost[];
  featuredMedia: MediaItem[];
  recentUploads: MediaItem[];
  config: MediaUploadConfig;
  uploadProgress: Map<string, number>;
}>({
  media: [],
  albums: defaultAlbums,
  socialPosts: [],
  featuredMedia: [],
  recentUploads: [],
  config: defaultMediaConfig,
  uploadProgress: new Map(),
});

// Derived stores
export const publicMedia = derived(mediaGallery, ($media) =>
  $media.media.filter((item) => item.is_public)
);

export const featuredImages = derived(mediaGallery, ($media) =>
  $media.media.filter((item) => item.is_featured && item.file_type === "image")
);

export const mediaByAlbum = derived(mediaGallery, ($media) => {
  const albumMedia = new Map<string, MediaItem[]>();

  $media.albums.forEach((album) => {
    albumMedia.set(album.id, []);
  });

  $media.media.forEach((item) => {
    const tags = item.tags?.split(",").map((tag) => tag.trim()) || [];
    tags.forEach((tag) => {
      if (albumMedia.has(tag)) {
        albumMedia.get(tag)!.push(item);
      }
    });
  });

  return albumMedia;
});

export const pendingSocialPosts = derived(mediaGallery, ($media) =>
  $media.socialPosts.filter(
    (post) => post.status === "draft" || post.status === "scheduled"
  )
);

// Media gallery actions
export const mediaActions = {
  // Load all media
  async loadMedia(): Promise<void> {
    try {
      const response = await fetch("/api/media");
      if (response.ok) {
        const media: MediaItem[] = await response.json();

        mediaGallery.update((state) => ({
          ...state,
          media: media.sort(
            (a, b) =>
              new Date(b.uploaded_at).getTime() -
              new Date(a.uploaded_at).getTime()
          ),
          featuredMedia: media.filter((item) => item.is_featured),
          recentUploads: media.slice(0, 10),
        }));
      }
    } catch (error) {
      console.error("Failed to load media:", error);
    }
  },

  // Upload media file
  async uploadMedia(
    file: File,
    title: string,
    description?: string,
    tags?: string,
    albumId?: string,
    isFeatured: boolean = false,
    isPublic: boolean = true
  ): Promise<{ success: boolean; mediaId?: number; error?: string }> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description || "");
      formData.append("tags", tags || "");
      formData.append("album_id", albumId || "");
      formData.append("is_featured", isFeatured.toString());
      formData.append("is_public", isPublic.toString());

      // Track upload progress
      const uploadId = `upload_${Date.now()}`;

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      // Clear upload progress
      mediaGallery.update((state) => {
        const newProgress = new Map(state.uploadProgress);
        newProgress.delete(uploadId);
        return { ...state, uploadProgress: newProgress };
      });

      if (response.ok) {
        const result = await response.json();
        await this.loadMedia();
        return { success: true, mediaId: result.id };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to upload media:", error);
      return { success: false, error: "Failed to upload media" };
    }
  },

  // Validate file before upload
  validateFile(file: File): { isValid: boolean; error?: string } {
    const config = this.getCurrentConfig();

    if (file.size > config.maxFileSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum limit of ${(config.maxFileSize / 1024 / 1024).toFixed(1)}MB`,
      };
    }

    if (!config.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not supported`,
      };
    }

    return { isValid: true };
  },

  // Get current configuration
  getCurrentConfig(): MediaUploadConfig {
    let config: MediaUploadConfig;
    mediaGallery.subscribe((state) => {
      config = state.config;
    })();
    return config!;
  },

  // Update media item
  async updateMedia(
    mediaId: number,
    updates: Partial<MediaItem>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/media/${mediaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await this.loadMedia();
        return { success: true };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to update media:", error);
      return { success: false, error: "Failed to update media" };
    }
  },

  // Delete media item
  async deleteMedia(
    mediaId: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/media/${mediaId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await this.loadMedia();
        return { success: true };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to delete media:", error);
      return { success: false, error: "Failed to delete media" };
    }
  },

  // Create album
  async createAlbum(
    name: string,
    description: string,
    isPublic: boolean = true
  ): Promise<{ success: boolean; albumId?: string; error?: string }> {
    const albumId = `album_${Date.now()}`;
    const album: MediaAlbum = {
      id: albumId,
      name,
      description,
      media_count: 0,
      created_at: new Date().toISOString(),
      is_public: isPublic,
    };

    try {
      const response = await fetch("/api/media/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(album),
      });

      if (response.ok) {
        mediaGallery.update((state) => ({
          ...state,
          albums: [...state.albums, album],
        }));
        return { success: true, albumId };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to create album:", error);
      return { success: false, error: "Failed to create album" };
    }
  },

  // Load social posts
  async loadSocialPosts(): Promise<void> {
    try {
      const response = await fetch("/api/social-posts");
      if (response.ok) {
        const socialPosts: SocialPost[] = await response.json();

        mediaGallery.update((state) => ({
          ...state,
          socialPosts: socialPosts.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to load social posts:", error);
    }
  },

  // Create social media post
  async createSocialPost(
    platform: SocialPost["platform"],
    content: string,
    mediaId?: number,
    scheduledFor?: string
  ): Promise<{ success: boolean; postId?: number; error?: string }> {
    try {
      const postData = {
        platform,
        content,
        media_id: mediaId,
        status: scheduledFor ? "scheduled" : "draft",
        scheduled_for: scheduledFor,
      };

      const response = await fetch("/api/social-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const result = await response.json();
        await this.loadSocialPosts();
        return { success: true, postId: result.id };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to create social post:", error);
      return { success: false, error: "Failed to create social post" };
    }
  },

  // Publish social post
  async publishSocialPost(
    postId: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/social-posts/${postId}/publish`, {
        method: "POST",
      });

      if (response.ok) {
        await this.loadSocialPosts();
        return { success: true };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to publish social post:", error);
      return { success: false, error: "Failed to publish social post" };
    }
  },

  // Generate social media content from media
  generateSocialContent(
    mediaItem: MediaItem,
    platform: SocialPost["platform"]
  ): string {
    const baseContent = `Check out this great moment from the IBM Charity Golf Tournament! 🏌️‍♂️`;

    const platformContent = {
      twitter: `${baseContent} #IBMGolf #CharityGolf #Tournament ${
        mediaItem.tags
          ? mediaItem.tags
              .split(",")
              .map((tag) => `#${tag.trim().replace(/\s+/g, "")}`)
              .join(" ")
          : ""
      }`,
      facebook: `${baseContent}\n\n${mediaItem.description || ""}\n\nThank you to all our participants and sponsors for making this tournament a success!`,
      instagram: `${baseContent} 📸\n\n${mediaItem.description || ""}\n\n${
        mediaItem.tags
          ? mediaItem.tags
              .split(",")
              .map((tag) => `#${tag.trim().replace(/\s+/g, "")}`)
              .join(" ")
          : ""
      } #IBMGolf #CharityGolf`,
      linkedin: `We're proud to share highlights from the IBM Charity Golf Tournament. ${mediaItem.description || ""}\n\nEvents like this demonstrate our commitment to community engagement and charitable giving.`,
    };

    return platformContent[platform] || baseContent;
  },

  // Batch upload multiple files
  async batchUpload(
    files: FileList,
    albumId?: string,
    onProgress?: (completed: number, total: number) => void
  ): Promise<{
    success: boolean;
    uploaded: number;
    failed: number;
    errors: string[];
  }> {
    const results = {
      success: true,
      uploaded: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const title = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
        const result = await this.uploadMedia(file, title, "", albumId);

        if (result.success) {
          results.uploaded++;
        } else {
          results.failed++;
          results.errors.push(`${file.name}: ${result.error}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`${file.name}: Upload failed`);
      }

      // Report progress
      if (onProgress) {
        onProgress(i + 1, files.length);
      }
    }

    results.success = results.failed === 0;
    return results;
  },

  // Get media statistics
  getMediaStats(media: MediaItem[]): {
    totalItems: number;
    totalSize: number;
    byType: Record<string, number>;
    publicItems: number;
    featuredItems: number;
    averageViews: number;
  } {
    const stats = {
      totalItems: media.length,
      totalSize: media.reduce((sum, item) => sum + item.file_size, 0),
      byType: {} as Record<string, number>,
      publicItems: media.filter((item) => item.is_public).length,
      featuredItems: media.filter((item) => item.is_featured).length,
      averageViews: 0,
    };

    // Count by file type
    media.forEach((item) => {
      stats.byType[item.file_type] = (stats.byType[item.file_type] || 0) + 1;
    });

    // Calculate average views
    const totalViews = media.reduce((sum, item) => sum + (item.views || 0), 0);
    stats.averageViews =
      media.length > 0 ? Math.round(totalViews / media.length) : 0;

    return stats;
  },

  // Search media
  searchMedia(
    query: string,
    filters?: {
      type?: "image" | "video";
      featured?: boolean;
      public?: boolean;
      tags?: string[];
    }
  ): MediaItem[] {
    let currentMedia: MediaItem[] = [];
    mediaGallery.subscribe((state) => {
      currentMedia = state.media;
    })();

    return currentMedia.filter((item) => {
      // Text search
      const searchText = query.toLowerCase();
      const matchesText =
        !query ||
        item.title.toLowerCase().includes(searchText) ||
        item.description?.toLowerCase().includes(searchText) ||
        item.tags?.toLowerCase().includes(searchText);

      if (!matchesText) return false;

      // Apply filters
      if (filters?.type && item.file_type !== filters.type) return false;
      if (
        filters?.featured !== undefined &&
        item.is_featured !== filters.featured
      )
        return false;
      if (filters?.public !== undefined && item.is_public !== filters.public)
        return false;

      if (filters?.tags && filters.tags.length > 0) {
        const itemTags =
          item.tags?.split(",").map((tag) => tag.trim().toLowerCase()) || [];
        const hasMatchingTag = filters.tags.some((tag) =>
          itemTags.includes(tag.toLowerCase())
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  },

  // Generate media slideshow
  generateSlideshow(
    mediaItems: MediaItem[],
    autoPlay: boolean = true
  ): {
    slides: Array<{
      id: number;
      title: string;
      image: string;
      description?: string;
      duration: number;
    }>;
    totalDuration: number;
  } {
    const slides = mediaItems
      .filter((item) => item.file_type === "image" && item.is_public)
      .map((item) => ({
        id: item.id,
        title: item.title,
        image: item.file_path,
        description: item.description,
        duration: 5000, // 5 seconds per slide
      }));

    return {
      slides,
      totalDuration: slides.length * 5000,
    };
  },
};

// Initialize media gallery
mediaActions.loadMedia();
mediaActions.loadSocialPosts();

export { mediaGallery as mediaGalleryStore };
