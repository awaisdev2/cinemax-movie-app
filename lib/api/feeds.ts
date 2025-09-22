import apiClient from "./client";

interface GetFeedApiParams {
  page?: number | string;
  limit?: number;
  type?: string;
  categoryId?: string | number | null;
  userId?: string | null;
  isHighlighted?: boolean;
}

interface GetGlobalSearchParams {
  page: number | string;
  limit?: number;
  search: string;
}

const communityId = "63857c8d-4adf-4161-89b0-77a5ee4a51ab";

export const fetchFeeds = async (params: GetFeedApiParams): Promise<any> => {
  const response = await apiClient.get(`/c/${communityId}/user-feeds`, {
    params,
  });
  return response.data?.data || [];
};

export const fetchFeedById = async (
  feedId: number,
  params: GetFeedApiParams
) => {
  const response = await apiClient.get(
    `/c/${communityId}/user-feeds/${feedId}`,
    {
      params,
    }
  );
  return response.data?.data || [];
};

export const fetchTrendingFeeds = async (params: GetFeedApiParams) => {
  const response = await apiClient.get(
    `/c/${communityId}/user-feeds/trending`,
    {
      params,
    }
  );
  return response.data?.data || [];
};

export const deleteFeed = async (id: number) => {
  const response = await apiClient.delete(`/c/${communityId}/user-feeds/${id}`);
  return response.data?.data || {};
};

export const postFeed = async (feedData: any) => {
  const response = await apiClient.post(
    `/c/${communityId}/user-feeds`,
    feedData
  );
  return response.data?.data || {};
};

export const updateFeed = async (id: any, feedData: any) => {
  const response = await apiClient.put(
    `/c/${communityId}/user-feeds/${id}`,
    feedData
  );
  return response.data?.data || {};
};

export const updateEnableComment = async (id: any, feedData: any) => {
  const response = await apiClient.put(
    `/c/${communityId}/user-feeds/${id}/enable-comment`,
    feedData
  );
  return response.data?.data || {};
};

export const fetchComments = async (
  feedId: any,
  limit: number
): Promise<any> => {
  const response = await apiClient.get(
    `/c/${communityId}/user-feeds/${feedId}/comments?limit=${limit}`
  );
  return response.data?.data || [];
};

export const postFeedComment = async (feedId: number, commentData: any) => {
  const response = await apiClient.post(
    `/c/${communityId}/user-feeds/${feedId}/comments`,
    commentData
  );
  return response.data?.data || {};
};

export const deleteFeedComment = async (feedId: number, commentId: number) => {
  const response = await apiClient.delete(
    `/c/${communityId}/user-feeds/${feedId}/comments/${commentId}`
  );
  return response.data?.data || {};
};

export const postFeedCommentLike = async (
  feedId: number,
  commentId: number
) => {
  const response = await apiClient.post(
    `/c/${communityId}/user-feeds/${feedId}/comments/${commentId}/likes`
  );
  return response.data?.data || {};
};

export const postFeedLike = async (feedId: number) => {
  const response = await apiClient.post(
    `/c/${communityId}/user-feeds/${feedId}/likes`
  );
  return response.data?.data || {};
};

export const updateFeedComment = async (
  feedId: number,
  commentId: number,
  commentData: any
) => {
  const response = await apiClient.put(
    `/c/${communityId}/user-feeds/${feedId}/comments/${commentId}`,
    commentData
  );
  return response.data?.data || {};
};

export const searchInCommunity = async (
  params: GetGlobalSearchParams
): Promise<any> => {
  const response = await apiClient.get(`/communities/${communityId}/search`, {
    params,
  });
  return response.data?.data || [];
};

export const updateFeedWatch = async (feedId: number) => {
  const response = await apiClient.post(
    `/c/${communityId}/user-feeds/${feedId}/watch`
  );
  return response.data?.data || {};
};

export const getCategories = async (params: GetFeedApiParams): Promise<any> => {
  const response = await apiClient.get(`/communities/${communityId}/categories`, {
    params,
  })
  return response.data?.data || []
}
