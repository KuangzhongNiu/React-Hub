import React from 'react'
import { supabase } from '../supabase-client.js'
import { useSearchParams } from 'react-router'
import './CreatePost.css'

export function CreatePost() {

    const [searchParams, setSearchParams] = useSearchParams()

    const initialState = {
        title: '',
        content: '',
        image_url: '',
        secret_key: '',
        referenced_post_id: searchParams.get('reference') || '',
        post_type: '',
        video_url: ''
    }


    const [post, setPost] = React.useState(initialState)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [success, setSuccess] = React.useState(false)

    const [isIdValid, setIsIdValid] = React.useState(null)

    async function checkID(postID) {
        setIsIdValid(null)

        const { data, error } = await supabase
            .from('Posts')
            .select('id')
            
        if (error) {
            throw error
        }

        if (data) {
            const idArray = data.map(function(item) {
                return item.id
            })
            setIsIdValid(idArray.includes(Number(postID)))
            return idArray.includes(Number(postID))       
        }

    }

    

    function handleChange(event) {

        setSuccess(false)
        setError(null)
        setIsIdValid(null)

        const {name, value} = event.currentTarget
        setPost(function(prevPost) {
            return ({
                ...prevPost,
                [name]: value
            })
        })
    }


    async function handleSubmit(event) {
        event.preventDefault()

        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            // Check if secret key are empty spaces 
            if (!post.secret_key.trim()) {
                setError({message: 'Secrey key cannot be empty spaces!'})
                return
            }

            // Check id
            if (post.referenced_post_id) {
                const isValid = await checkID(post.referenced_post_id)
                
                if (!isValid) {
                    setError({message: 'Invalid Referenced Post ID!'})
                    return
                }
            }


            const { data, error } = await supabase
                .from('Posts')
                .insert({ 
                    title: post.title,
                    content: post.content,
                    image_url: post.image_url,
                    secret_key: post.secret_key,
                    referenced_post_id: post.referenced_post_id ? Number(post.referenced_post_id) : null,
                    upvotes: 0,
                    post_type: post.post_type,
                    video_url: post.video_url
                })
                .select('*')

            if (error) {
                throw error
            }

            setPost(initialState)
            setSuccess(true)

        } catch(error) {
            setError(error)
        } finally {
            setLoading(false)
        }
        
    }



    return (
        <section className='create-section'>

            <form onSubmit={handleSubmit} className='create-form'>
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

                <label htmlFor='referenced-id'>
                    Referenced Post ID{searchParams.get('reference') ? '' : ' (Optional)'}:
                </label>
                <input 
                    className={`referenced-id-input ${isIdValid === false ? 'wrong' : ''}`}
                    type='number'
                    id='referenced-id'
                    name='referenced_post_id'
                    onChange={handleChange}
                    value={post.referenced_post_id}
                    readOnly={searchParams.get('reference')}
                    placeholder='Enter post ID'
                />

                
                <label htmlFor='secret-key'>Secret Key:</label>
                <input 
                    className='key-input'
                    type='password'
                    id='secret-key'
                    name='secret_key'
                    onChange={handleChange}
                    value={post.secret_key}
                    placeholder='Create a secret key for managing your post'
                    required
                />
                <p className="input-hint">
                    *Your secret key is permanent and cannot be edited after submission.
                </p>
            

                <button 
                    type="submit"
                    className='create-post'
                    disabled={loading}
                    aria-busy={loading}
                >
                    {loading ? 'Creating...' : 'Create Post'}
                </button>

                {success && (
                    <p 
                        role="status" 
                        className='status-message status-message-success'
                    >
                        Post created successfully!
                    </p>
                )}
                
                {error && (
                    <p 
                        role="alert" 
                        className='status-message status-message-error'
                    >
                        An error occured: {error.message}
                    </p>
                )}
            </form>
        </section>
    )
}