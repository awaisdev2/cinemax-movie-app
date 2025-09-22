import * as feedsApi from "@/lib/api/feeds";
import { COMMENTS_QUERY_KEY, FEEDS_QUERY_KEY } from "@/lib/reactQueryKeys";
import { parseError } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGetFeedComments = (feedId: number) => {
  return useQuery({
    queryKey: [COMMENTS_QUERY_KEY, feedId],
    queryFn: () => feedsApi.fetchComments(feedId, 1000),
  });
};

export const useUpdateFeedComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      feedId,
      commentId,
      commentData,
    }: {
      feedId: number;
      commentId: number;
      commentData: any;
    }) => feedsApi.updateFeedComment(feedId, commentId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENTS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(parseError(error));
    },
  });
};

export const useCreateFeedComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      feedId,
      commentData,
    }: {
      feedId: number;
      commentData: any;
    }) => feedsApi.postFeedComment(feedId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [FEEDS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(parseError(error));
    },
  });
};

export const useDeleteFeedComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      feedId,
      commentId,
    }: {
      feedId: number;
      commentId: number;
    }) => feedsApi.deleteFeedComment(feedId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENTS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(parseError(error));
    },
  });
};

export const useLikeFeedComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      feedId,
      commentId,
    }: {
      feedId: number;
      commentId: number;
    }) => feedsApi.postFeedCommentLike(feedId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMMENTS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(parseError(error));
    },
  });
};

export const useDisableComment = () => {
  return useMutation({
    mutationFn: ({
      feedId,
      feedData,
    }: {
      feedId: string | number;
      feedData: any;
    }) => feedsApi.updateEnableComment(feedId, feedData),
    onSuccess: (data, { feedData }) => {
      toast.success(
        `Comments ${
          feedData.commentsEnabled ? "enabled" : "disabled"
        } successfully`
      );
    },
    onError: (error: any) => {
      toast.error(parseError(error));
    },
  });
};
