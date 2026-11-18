import React from 'react'
import { supabase } from '../supabase-client.js'
import { useParams } from 'react-router'
import './EditPost.css'

export function EditPost() {

    const params = useParams()
    const [post, setPost] = React.useState({})

    const [loadingFetch, setLoadingFetch] = React.useState(false)
    const [loadingUpdate, setLoadingUpdate] = React.useState(false)
    const [errorFetch, setErrorFetch] = React.useState(null)
    const [errorUpdate, setErrorUpdate] = React.useState(null)
    const [success, setSuccess] = React.useState(false)

    React.useEffect(function() {

        async function fetchPost() {
            
            setLoadingFetch(true)
            setErrorFetch(null)

            try {
                const { data, error } = await supabase
                    .from('Posts')
                    .select()
                    .eq('id', Number(params.id))
                    .single()

                if (error) {
                    throw error
                }

                setPost(data)
        
            } catch(error) {
                setErrorFetch(error)
            } finally {
                setLoadingFetch(false)
            }
        }

        fetchPost()

    }, [params.id])


    function handleChange(event) {
        
        setSuccess(false)
        setErrorUpdate(null)

        const {name, value} = event.currentTarget
        setPost(function(prevPost) {
            return ({
                ...prevPost,
                [name]: value
            })
        })
    }


    async function handleUpdate(event) {
        event.preventDefault()

        setLoadingUpdate(true)
        setErrorUpdate(null)
        setSuccess(false)

        try {

            const { data, error } = await supabase
                .from('Posts')
                .update(post)
                .eq('id', Number(params.id))
                .select('*')
                .single() 

            if (error) {
                throw error
            }

            setSuccess(true)
            
        } catch(error) {
            setErrorUpdate(error)
        } finally {
            setLoadingUpdate(false)
        }

    }


    return (
        <section className='edit-section'>

            {loadingFetch && (
                <p 
                    aria-live="polite"
                    className='status-message'
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

            {!loadingFetch && !errorFetch && (
                <form onSubmit={handleUpdate} className='update-form'>
                    <label htmlFor="title">Title:</label>
                    <input 
                        className='title-input'
                        type="text"
                        id="title"
                        name="title"
                        onChange={handleChange}
                        value={post.title}
                        placeholder="What's your question or topic?"
                        required
                    />

                    <label htmlFor='post-type'>Post Type:</label>
                    <select 
                        className='post-type' 
                        id='post-type' 
                        name='post_type' 
                        onChange={handleChange}
                        value={post.post_type}
                        required
                    >
                        <option value="" disabled>-- Choose a type --</option>
                        <option value='Question'>Question</option>
                        <option value='Resources'>Resources</option>
                        <option value='Discussion'>Discussion</option>
                    </select>


                    <label htmlFor="content">Content (Optional):</label>
                    <textarea
                        className='content-input'
                        id="content"
                        name="content"
                        onChange={handleChange}
                        value={post.content}
                        style={{ 
                            width: '100%',    
                            height: '200px',    
                            resize: 'none'     
                        }} 
                        placeholder='Provide more details...'
                    >
                    </textarea>

                    <label htmlFor="post-image">Image (Optional):</label>
                    <input 
                        className='image-url-input'
                        type="url"
                        id="post-image"
                        name='image_url'
                        onChange={handleChange}
                        value={post.image_url}
                        placeholder='https://example.com/image.png'
                    />

                    <label htmlFor='post-video'>Video URL (Optional):</label>
                    <input
                        className='video-url-input'
                        type="url"
                        id="post-video"
                        name="video_url"
                        placeholder="Enter a video URL"
                        value={post.video_url}
                        onChange={handleChange}
                    />

                
                    {post.referenced_post_id && (
                        <>
                            <label htmlFor='referenced-id'>
                                Referenced Post ID:
                            </label>
                            <input 
                                className={`referenced-id-input`}
                                type='number'
                                id='referenced-id'
                                name='referenced_post_id'
                                value={post.referenced_post_id}
                                readOnly={true}
                            />
                        </>
                    )}

                    <button 
                        type="submit" 
                        className='update-post'
                        disabled={loadingUpdate}
                        aria-busy={loadingUpdate}
                    >
                        {loadingUpdate ? 'Updating...' : 'Update Post'}
                    </button>

                    {success && (
                        <p 
                            role="status" 
                            className='status-message status-message-success'
                        >
                            Post updated successfully!
                        </p>
                    )}

                    {errorUpdate && (
                        <p 
                            role="alert" 
                            className='status-message status-message-error' 
                        >
                            Error updating post: {errorUpdate.message}
                        </p>
                    )}
                    
                </form>
            )}
        </section>
        
        
    )
}