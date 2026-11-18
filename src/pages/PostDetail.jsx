import { supabase } from "../supabase-client.js"
import React from 'react'
import { useParams, Link, useNavigate } from "react-router"
import { ReferencedPost } from "../components/ReferencedPost.jsx"
import './PostDetail.css'

export function PostDetail() {
    

    const navigate = useNavigate()
    const params = useParams()
    const [post, setPost] = React.useState(null)

    const [referencedPost, setReferencedPost] = React.useState(null)
    const [errorReferencedPost, setErrorReferencedPost] = React.useState(null)

    
    const [secretKeyInput, setSecretKeyInput] = React.useState('')
    const [isKeyCorrect, setIsKeyCorrect] = React.useState(null)
    

    const initialComment = ''
    const [comment, setComment] = React.useState(initialComment)

    const [loadingFetch, setLoadingFetch] = React.useState(false)
    const [errorFetch, setErrorFetch] = React.useState(null)

    const [loadingUpvote, setLoadingUpvote] = React.useState(false)
    const [errorUpvote, setErrorUpvote] = React.useState(null)

    const [loadingComment, setLoadingComment] = React.useState(false)
    const [errorComment, setErrorComment] = React.useState(null)

    const [loadingDelete, setLoadingDelete] = React.useState(false)
    const [errorDelete, setErrorDelete] = React.useState(null)
    const [hasDeleted, setHasDeleted] = React.useState(false)


    // Comment deletion
    const [loadingCommentDelete, setLoadingCommentDelete] = React.useState(false)
    const [errorDeleteComment, setErrorDeleteComment] = React.useState(null)
    const [commentIndex, setCommentIndex] = React.useState(null)

    // Dialog 
    const dialogSection = React.useRef(null)
    const [action, setAction] = React.useState({
        delete: false,
        update: false,
        comment: false
    })


    React.useEffect(function() {

        async function getPost() {

            setLoadingFetch(true)
            setErrorFetch(null)

            setReferencedPost(null)
            setErrorReferencedPost(null)

            try {
                const { data, error } = await supabase
                    .from('Posts')
                    .select('*')
                    .eq('id', Number(params.id))
                    .single()

                if (error) {
                    throw error
                }

                // Fetch referenced post, if it exists
                if (data.referenced_post_id) {
                    try {
                        const { data: referencedPostData, error: referencedPostError } = await supabase
                            .from('Posts')
                            .select('*')
                            .eq('id', Number(data.referenced_post_id))
                            .single()

                        if (referencedPostError) {
                            throw referencedPostError
                        }

                        setReferencedPost(referencedPostData)

                    } catch (referencedPostError) {
                        setErrorReferencedPost(referencedPostError)
                    } 

                }
                
                setPost(data)
        

            } catch(error) {
                setErrorFetch(error)
            } finally {
                setLoadingFetch(false)
            }

        }

        getPost()

    }, [params.id])



    async function handleUpvote() {

        setLoadingUpvote(true)
        setErrorUpvote(null)

        try {
            const { data, error } = await supabase
                .from('Posts')
                .update({ upvotes: post.upvotes + 1 })
                .eq('id', Number(params.id))
                .select('*')
                .single()
            
            if (error) {
                throw error
            }

            setPost(data)
        } catch(error) {
            setErrorUpvote(error)
        } finally {
            setLoadingUpvote(false)
        }

    }



    function handleChange(event) {
        setErrorComment(null)
        setComment(event.currentTarget.value)
    }


    function handleSecretKeyChange(event) {
        setIsKeyCorrect(null)
        setSecretKeyInput(event.currentTarget.value)
    }


    function handleCancel() {
        setIsKeyCorrect(null)
        setSecretKeyInput('')
        setCommentIndex(null)
        setAction({
            delete: false,
            update: false,
            comment: false
        })
        dialogSection.current.close()
    }



    async function submitComment(event) {
        event.preventDefault()

        if (!comment.trim()) {
            setErrorComment({message: 'Comment cannot be empty!'})
            return 
        }

        let newComments = post.comments ? [...post.comments, comment] : [comment]

        setLoadingComment(true)
        setErrorComment(null)

        try {
            const { data, error } = await supabase
                .from('Posts')
                .update({ comments: newComments })
                .eq('id', Number(params.id))
                .select('*')
                .single()

            if (error) {
                throw error
            }

            setPost(data)
            setComment(initialComment)

        } catch(error) {
            setErrorComment(error)
        } finally {
            setLoadingComment(false)
        }
    }



    async function handleDelete() {

        setLoadingDelete(true)
        setErrorDelete(null)
        setHasDeleted(false)

        dialogSection.current.close()
       
        try {
            const { data, error } = await supabase
                .from('Posts')
                .delete()
                .eq('id', Number(params.id))
                .select('*')
                .single()
            
            if (error) {
                throw error
            }

            setHasDeleted(true)

        } catch(error) {
            setErrorDelete(error)
        } finally {
            setLoadingDelete(false)
        }
 
    }



    function handleAction(event) {
        event.preventDefault()

        if (secretKeyInput.trim() === post.secret_key) {
            setIsKeyCorrect(true)
        } else {
            setIsKeyCorrect(false)
            return 
        }

        if (action.delete) {
            handleDelete()
        } else if (action.update) {
            navigate(`/edit/${params.id}`)
        } else if (action.comment) {
            handleDeleteComment()
        }
    }



    async function handleDeleteComment() {
        const commentID = Number(commentIndex)

        const updatedComments = post.comments.filter(function(comment, index) {
            return index != commentID
        })

        setIsKeyCorrect(null)
        setSecretKeyInput('')

        setLoadingCommentDelete(true)
        setErrorDeleteComment(null)

        dialogSection.current.close()

        try {
            const { data, error } = await supabase
                .from('Posts')
                .update({comments: updatedComments})
                .eq('id', Number(params.id))
                .select('*')
                .single() 

            if (error) {
                throw error
            }
        
            setPost(data)

            setCommentIndex(null)

        } catch(error) {
            setErrorDeleteComment(error)
        } finally {
            setLoadingCommentDelete(false)
        }
        
    }




    return (
        <section className="detail-section">

            {loadingFetch && (
                <p 
                    aria-live="polite"
                    className="status-message"
                >
                    Loading...
                </p>
            )}

            {errorFetch && !loadingFetch && (
                <p 
                    role="alert" 
                    className='status-message status-message-error'
                >
                    Error fetching post: {errorFetch.message}
                </p>
            )}

            {!loadingFetch && post && !errorFetch && (
                !hasDeleted && (
                    <div className="post-container">
                        
                        <div className="type-id-container">
                            <p className="detail-page-post-type">{post.post_type}</p>
                            <p className="post-id">Post ID: #{post.id}</p>
                        </div>

                        <h2 className="post-title">{post.title}</h2>

                        <p className="post-time">Created at: {new Date(post.created_at).toLocaleString()}</p>

                        <div className="post-content-container">
                            <p className="post-content">{post.content}</p>

                            {post.image_url && (
                                <div className="post-image-container">
                                    <img src={post.image_url} className="post-image"/>
                                </div>
                            )}

            
                            {post.video_url && (
                                <iframe
                                    src={post.video_url}
                                    title="YouTube video player"
                                    className="post-video"
                                    allowFullScreen
                                />
                            )}

                        
                            {post.referenced_post_id && (
                                <ReferencedPost 
                                    refPost={referencedPost} 
                                    refPostError={errorReferencedPost}
                                />
                            )}
                        </div>

                        <div className="buttons-container">
                            <div className="upvotes-button-container">
                                <button 
                                    onClick={handleUpvote}
                                    className="upvote-button"
                                    disabled={loadingUpvote}
                                    aria-busy={loadingUpvote}
                                >
                                    {loadingUpvote ? 'Upvoting...' : 'Upvote'}
                                </button>

                                <p className="upvotes-count">
                                    {post.upvotes} {post.upvotes === 1 ? 'upvote' : 'upvotes'}
                                </p>
                            </div>

                            
                            <div className="update-button-container">
                                <Link
                                    to={`/create?reference=${params.id}`}
                                    className="repost-button"
                                >
                                    Repost
                                </Link>

                                <button
                                    className="update-button"
                                    onClick={() => {
                                        dialogSection.current.showModal()
                                        setAction({
                                            delete: false,
                                            update: true,
                                            comment: false
                                        })
                                    }}
                                >
                                    Update
                                </button>

                                <button
                                    onClick={() => {
                                        dialogSection.current.showModal()
                                        setAction({
                                            delete: true,
                                            update: false,
                                            comment: false
                                        })
                                    }}
                                    className="delete-button"
                                    disabled={loadingDelete}
                                    aria-busy={loadingDelete}
                                >
                                    {loadingDelete ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                            
                        </div>

                        {errorUpvote && (
                            <p 
                                role="alert" 
                                className='status-message status-message-error'
                            >
                                Couldn't upvote this post. Please try again.
                            </p>
                        )}

                        {errorDelete && (
                            <p 
                                role="alert" 
                                className='status-message status-message-error'
                            >
                                Error deleting post: {errorDelete.message}
                            </p>
                        )}

                        {/* Comments section */}
                        <div className="comments-container">
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map(function(comment, index){
                                    return (
                                        <div key={index} id={index} className="comment-container">
                                            <p>-</p>
                                            <p className="comment">{comment}</p>
                                            <button 
                                                className="delete-comment" 
                                                id={index} 
                                                onClick={() => {
                                                    setCommentIndex(index)
                                                    setAction({
                                                        delete: false,
                                                        update: false,
                                                        comment: true
                                                    })
                                                    dialogSection.current.showModal()
                                                }}
                                                disabled={loadingCommentDelete}
                                                aria-busy={loadingCommentDelete}
                                            >
                                                {loadingCommentDelete ? 'Deleting...' : 'Delete'}
                                            </button>

                                            {errorDeleteComment && (
                                                <p 
                                                    role="alert" 
                                                    className='status-message status-message-error'
                                                >
                                                    Failed to delete comment: {errorDeleteComment.message}
                                                </p>
                                            )}
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="no-comments-message">
                                    No comments yet. Be the first to share your thoughts!
                                </p>
                            )}

                            <form onSubmit={submitComment} className="comment-form">
                                <label htmlFor="comment">Leave a comment:</label>
                                <textarea 
                                    type="text"
                                    id="comment"
                                    name="comment"
                                    value={comment}
                                    onChange={handleChange}
                                    placeholder="Share your thoughts..."
                                    style={{ 
                                        width: '100%',    
                                        // height: '30px',    
                                        resize: 'none'     
                                    }} 
                                    rows={2}
                                    required
                                >
                                </textarea>

                                <button 
                                    type="submit" 
                                    className="submit-comment-button"
                                    disabled={loadingComment}
                                    aria-busy={loadingComment}
                                >
                                    {loadingComment ? 'Submitting...' : 'Submit'}
                                </button>
                                
                                {errorComment && (
                                    <p 
                                        role="alert" 
                                        className='status-message status-message-error'
                                    >
                                        Error submitting your comment: {errorComment.message}
                                    </p>
                                )}

                            </form>
                        </div>
                        
                    </div>
                )
            )}

            {hasDeleted && (
                <>
                    <p className="status-message" role="status">
                        Post deleted successfully!
                    </p>
                    <button 
                        onClick={() => navigate('/')}
                        className="back-to-home-button"
                    >
                        ←Back to Home
                    </button>
                </>
            )}
            
            {/* Dialog window */}
            <dialog 
                ref={dialogSection}
            >
                <button 
                    className="close-button"
                    onClick={handleCancel}
                >
                    x
                </button>

                <h2 className="dialog-title">Confirm Your Action</h2>

                <p className="dialog-description">Please enter your secret key to proceed.</p>

                <form 
                    onSubmit={handleAction}
                    className="secret-key-form"
                >
                    <label 
                        htmlFor="key"
                    >
                        Secret key
                    </label>
                    <input 
                        className={`secret-key-input ${!isKeyCorrect && isKeyCorrect !== null  && 'wrong'}`}
                        id="key" 
                        type="password"
                        value={secretKeyInput}
                        onChange={handleSecretKeyChange}
                        placeholder="Enter secret key here..."
                        required
                    />

                    {isKeyCorrect !== null && !isKeyCorrect && (
                        <p 
                            role="alert" 
                            className="status-message status-message-error"
                        >
                            Incorrect secret key. Please try again.
                        </p>
                    )}

                    <div className="dialog-buttons-container">
                        <button 
                            className="cancel-button" 
                            type="button" 
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>

                        <button 
                            className="confirm-button" 
                            type="submit"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </dialog>
            
        </section>     
    )
}