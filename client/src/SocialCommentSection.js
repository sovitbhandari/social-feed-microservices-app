import SocialCommentCreate from './SocialCommentCreate';
import SocialCommentList from './SocialCommentList';

export default function CommentSection({ comments, onAddComment }) {
  return (
    <div className="mt-6">
      <h4 className="text-md font-semibold text-gray-700 mb-2">Comments</h4>
      <SocialCommentCreate onAddComment={onAddComment} />
      <SocialCommentList comments={comments} />
    </div>
  );
}
