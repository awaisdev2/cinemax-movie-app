import * as feedsApi from "@/lib/api/feeds";
import {
  CATEGORIES_QUERY_KEY,
  FEEDS_QUERY_KEY,
  FEED_BY_ID_QUERY_KEY,
  TRENDING_FEEDS_QUERY_KEY,
} from "@/lib/reactQueryKeys";
import { parseError } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface GetFeedsParams {
  userId?: string;
  isHighlighted?: boolean;
  categoryId?: string;
  page?: string | number;
  type?: string;
}
export const useGetFeeds = ({
  userId,
  isHighlighted,
  categoryId,
  page = "1",
  type,
}: GetFeedsParams) => {
  return useQuery({
    queryKey: [
      FEEDS_QUERY_KEY,
      { page, categoryId, userId, isHighlighted, type },
    ],
    queryFn: () =>
      feedsApi.fetchFeeds({
        page,
        limit: 30,
        categoryId,
        userId,
        isHighlighted,
        type,
      }),
    staleTime: 30 * 1000, // 30 seconds - data stays fresh for 30 seconds
    gcTime: 30 * 1000, // 30 seconds - cache garbage collection time (formerly cacheTime)
  });
};

export const useGetFeedById = ({
  feedId,
  type,
}: {
  feedId: number;
  type: string;
}) => {
  return useQuery({
    queryKey: [FEED_BY_ID_QUERY_KEY, feedId],
    queryFn: () => feedsApi.fetchFeedById(feedId, { type }),
    enabled: !!feedId,
  });
};

export const useGetTrendingFeeds = ({ type }: { type: string }) => {
  return useQuery({
    queryKey: [TRENDING_FEEDS_QUERY_KEY, { type }],
    queryFn: () => feedsApi.fetchTrendingFeeds({ type }),
  });
};

export const useCreateFeed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (feedData: any) => feedsApi.postFeed(feedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDS_QUERY_KEY] });
      toast.success("Feed created successfully");
    },
    onError: (error: any) => {
      toast.error(parseError(error));
    },
  });
};

export const useUpdateFeed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      feedId,
      feedData,
    }: {
      feedId: string | number;
      feedData: any;
    }) => feedsApi.updateFeed(feedId, feedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDS_QUERY_KEY] });
      toast.success("Feed updated successfully");
    },
    onError: (error: any) => {
      toast.error(parseError(error));
    },
  });
};

export const useDeleteFeed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (feedId: number) => feedsApi.deleteFeed(feedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDS_QUERY_KEY] });
      toast.success("Feed deleted successfully");
    },
    onError: (error: any) => {
      toast.error(parseError(error));
    },
  });
};

export const useAddFeedLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (feedId: number) => feedsApi.postFeedLike(feedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [TRENDING_FEEDS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(parseError(error));
    },
  });
};

export const useUpdateFeedWatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (feedId: number) => feedsApi.updateFeedWatch(feedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDS_QUERY_KEY] });
    },
    onError: (error: any) => {
      console.error(parseError(error));
    },
  });
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: () => feedsApi.getCategories({page: 1, limit: 100}),
  })
}
