export interface InstagramProfile {
  _id: string;
  username: string;
  metadata?: {
    fetched_at: string;
    processor_version: string;
    data_type: string;
  };
  simplified_profile: {
    basic_info: {
      username: string;
      full_name: string;
      biography: string;
      external_url?: string | null;
      profile_pic_url: string;
      profile_pic_url_hd?: string;
      id?: string;
      is_verified: boolean;
      is_private: boolean;
      is_business_account?: boolean;
      is_professional_account?: boolean;
      pronouns?: string[];
    };
    stats: {
      followers_count: number;
      following_count: number;
      posts_count: number;
      reels_count?: number;
      highlight_reel_count?: number;
      engagement_rate?: number;
      engagement?: number;
      average_likes?: number;
      average_comments?: number;
      average_reel_views?: number;
    };
    business_info?: {
      email?: string | null;
      phone?: string | null;
      category?: string | null;
      category_name?: string;
      address?: string | null;
    };
    bio_links?: Array<{
      title: string;
      lynx_url: string;
      url: string;
      link_type: string;
    }>;
    media_info?: {
      timeline_media?: {
        count: number;
        has_next_page: boolean;
        posts_sample?: Array<{
          id: string;
          shortcode: string;
          post_url: string;
          media_link: string;
          is_video: boolean;
          timestamp: number;
          likes: number;
          comments: number;
        }>;
      };
      reels?: {
        count: number;
        has_next_page: boolean;
      };
    };
    settings?: {
      has_clips: boolean;
      has_guides: boolean;
      has_channel: boolean;
      hide_like_and_view_counts: boolean;
    };
  };
}
