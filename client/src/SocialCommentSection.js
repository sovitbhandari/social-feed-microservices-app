import SocialCommentCreate from './SocialCommentCreate';
import SocialCommentList   from './SocialCommentList';

export default function CommentSection({
  postId,
  comments,
  onAddComment,
  onDeleteComment
}) {
  return (
    <div className="mt-6">
      <h4 className="text-md font-semibold text-gray-700 mb-2">Comments</h4>

      {/* create new */}
      <SocialCommentCreate postId={postId} onAddComment={onAddComment} />

      {/* list + delete */}
      <SocialCommentList
        comments={comments}
        onDeleteComment={onDeleteComment}
      />
    </div>
  );
}
