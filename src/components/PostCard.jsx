import { Link } from "react-router"
import './PostCard.css'

export function PostCard(props) {

    return (
        <Link
            to={`/post/${props.postObj.id}`}
            className="post-link"
        >
            <article className="post-card">
                <div className="title-container">
                    <p className="card-time">
                        Created at {new Date(props.postObj.created_at).toLocaleString()}
                    </p>
                    <p className='type-post'>{props.postObj.post_type}</p>
                </div>

                <h2 className="card-title">
                    {props.postObj.title}
                </h2>
                
                <p className="card-upvotes">
                    {props.postObj.upvotes} {props.postObj.upvotes === 1 ? 'upvote' : 'upvotes'}
                </p>      
            </article>
        </Link>
    )
}