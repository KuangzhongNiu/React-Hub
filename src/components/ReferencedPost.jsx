import { Link } from "react-router"
import './ReferencedPost.css'

export function ReferencedPost(props) {

    let commentCount = 0

    if (props.refPost && props.refPost.comments) {
        commentCount = props.refPost.comments.length
    }
    
    return (
        <section className="referenced-post-section">
            <p className="referenced-post-section-label">REFERENCED POST</p>

            {props.refPostError && (
                <p 
                    role="alert" 
                    className='status-message status-message-error'
                >
                    Error fetching referenced post: {props.refPostError.message}
                </p>
            )}

            {props.refPost && !props.refPostError && (
                <>
                    <h3 className="referenced-post-title">
                        {props.refPost.title}
                    </h3>
                    <p className="referenced-post-content">
                        {props.refPost.content.length > 200 
                            ? `${props.refPost.content.slice(0, 200)} ...` 
                            : props.refPost.content
                        }
                    </p>
                    <div className="referenced-post-bottom-container">
                        <div className="upvotes-comments-container">
                            <p>{props.refPost.upvotes} {props.refPost.upvotes === 1 ? 'upvote' : 'upvotes'}</p>
                            <p>·</p>
                            <p>
                                {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                            </p>
                        </div>
                        <Link
                            to={`/post/${props.refPost.id}`}
                            className="original-post-button"
                        >
                            View original post →
                        </Link>
                    </div>
                </>
            )}
        </section>
    )
}