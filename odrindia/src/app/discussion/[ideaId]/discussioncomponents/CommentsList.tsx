import { Comment, User } from "./types";
import CommentThread from "./CommentThread";
interface CommentsListProps {
  comments: Comment[];
  ideaId: string;
  userId?: string;
  commentLikes: Record<string, boolean>;
  expandedComments: Record<string, boolean>;
  user: User | null;
  onLikeComment: (commentId: string) => Promise<void>;
  onReply: (parentId: string) => void;
  onSubmitReply: (parentId: string, content: string) => Promise<void>;
  onToggleExpand: (commentId: string) => void;
  replyingTo: string | null;
}

export default function CommentsList({
  comments,
  ideaId,
  userId,
  commentLikes,
  expandedComments,
  user,
  onLikeComment,
  onReply,
  onSubmitReply,
  onToggleExpand,
  replyingTo,
}: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
        <p className="text-gray-500">
          No comments yet. Be the first to start the discussion!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentThread
          key={comment.id}
          comment={comment}
          ideaId={ideaId}
          userId={userId}
          commentLikes={commentLikes}
          expandedComments={expandedComments}
          user={user}
          onLikeComment={onLikeComment}
          onReply={onReply}
          onSubmitReply={onSubmitReply}
          onToggleExpand={onToggleExpand}
          replyingTo={replyingTo}
        />
      ))}
    </div>
  );
}
