import { UserModel } from "@/contexts/AuthContext";

interface FeedCategory {
  id: number;
  name: string;
  description: string;
  communityId: number;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FeedLike {
  id: number;
  userId: number;
  feedId: number;
  liked: boolean;
  createdAt: string;
  updatedAt: string;
  user: FeedUser;
  commentId: number | null;
}

interface FeedUser {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  bio: string;
  city: string;
  state: string;
  companyName: string;
  profilePic: string;
  profileCover: string | null;
  absoluteProfilePath: string;
  absoluteCoverPath: string;
  createdAt: number;
  updatedAt: number;
  isAdmin: boolean;
  isCustomer: boolean;
  userCommunities?: FeedUserCommunity[];
  userType: "customer" | "admin";
  uuid: string;
  address: string | null;
  companySize: number | null;
  createdById: number | null;
  deletedAt: number | null;
  email: string | null;
  isActive: boolean | null;
  phoneNumber: string | null;
  timezone: string | null;
  updatedById: number | null;
  username: string | null;
  yearsOfExperience: number | null;
}

interface FeedUserCommunity {
  id: number;
  communityId: number;
  isCommunityAdmin: boolean;
  isModerator: boolean;
  isMember: boolean;
  isFreeMember: boolean;
  isTeamMember: boolean;
  role: "member" | "admin" | "moderator";
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface FeedAttachment {
  originalFileName: string;
  signedFileName: string;
  fileType: string;
}

export interface FeedComment {
  id: number;
  feedId: number;
  comment: string;
  parentCommentId: number | null;
  createdAt: string;
  updatedAt: string;
  user: FeedUser;
  userId: number;
  _attachments: FeedAttachment[];
  attachments: string;
  feedCommentLikes: FeedLike[] | null;
  replies: FeedComment[] | null;
  mentions?: any[];
}

export interface UserFeedWatch {
  id: number;
  feedId: number;
  userId: number;
  watchUpdates: boolean;
  lastWatchedAt: string;
  createdAt: string;
}

export interface Feed {
  id: number;
  title: string;
  description: string;
  feedCategory: FeedCategory;
  feedLikes: FeedLike[];
  comments: FeedComment[];
  categoryId: number;
  commentsEnabled: boolean;
  communityId: number;
  createdAt: number;
  updatedAt: number;
  user: FeedUser;
  userId: number;
  attachments: string;
  _attachments: FeedAttachment[];
  feedType: "public" | "private";
  isHighlighted: boolean;
  isPinned: boolean;
  totalCommentsCount: number;
  userFeedWatch: UserFeedWatch;
}

export interface FeedsResponse {
  feeds: Feed[];
  totalPages: number;
  totalItems: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  communityId: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  deletedAt: string | null;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface FeedIndexCardProps {
  feed: Feed;
  currentUserId: number | undefined;
  index: number;
}

export interface FeedDetailModalProps {
  feed: Feed;
  showFeedDetailModal: boolean;
  handleModalClose: () => void;
}

export interface FeedCommentsProps {
  feedId: number;
  commentsEnabled: boolean;
}

export interface CommentRowProps {
  comment: FeedComment;
  index: string;
  isReply?: boolean;
  currentUserId: number | undefined;
  toggleReplyField: (index: string) => void;
  commentsEnabled: boolean;
}

export interface CategoriesFilterCardProps {
  feedType: string;
  categories: Category[];
  selectedCategoryId: string;
  setSelectedCategoryId: (value: string) => void;
}

export interface FeedAttachmentProps {
  isUploading?: boolean;
  attachments: FeedAttachment[];
  handleDeleteFile?: (index: number) => void;
  hideDeleteIcon?: boolean;
  template?: number;
}

export interface FeedCommentLikeActionProps {
  feed: Feed;
  setShowLevelDetailModal: (show: boolean) => void;
  closeModal: () => void;
}

export interface FeedCommentsFormProps {
  feedId: number;
  parentComment?: FeedComment | null;
  toggleReplyField?: (index: string | null) => void;
  editedComment?: FeedComment | null;
  setEditingIndex?: (index: string | null) => void;
}

export interface FeedFormProps {
  feed?: Feed | null;
  feedType?: string;
  setShowCreateFeedModal: (show: boolean) => void;
  user?: UserModel | null;
}

export interface FeedFormValues {
  title: string;
  description: string;
}

export interface FeedLikesCardProps {
  likes: FeedLike[];
}

export interface PreviewAttachmentsProps {
  attachments: FeedAttachment[];
  selectedAttachmentIndex: number | null;
  setSelectedAttachmentIndex: (index: number | null) => void;
  handleModalClose: () => void;
}

export interface RecentFeedLikesProps {
  likes: FeedLike[];
  feedId: number;
  currentUserId?: number | undefined;
  commentId?: number;
}

export interface RecentFeedCommentsProps {
  totalCommentsCount?: number;
  comments: FeedComment[];
  setShowFeedDetailModal: (show: boolean) => void;
}
