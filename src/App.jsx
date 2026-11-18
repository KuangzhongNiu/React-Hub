import React from 'react'
import './App.css'
import { useOutletContext, useSearchParams } from 'react-router'
import { supabase } from './supabase-client.js'
import { PostCard } from './components/PostCard.jsx'

export function App() {

  const {searchInput} = useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams() 

  const [posts, setPosts] = React.useState([])
  const [orderBy, setOrderBy] = React.useState('created_at')

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const typeFilter = searchParams.get('type')



  // Fetch posts from database
  React.useEffect(function() {
    async function fetchPosts() {
      
      setLoading(true)
      setError(null)
      
      try {
        const { data, error } = await supabase
          .from('Posts')
          .select('*')
          .order(orderBy, { ascending: false })

        if (error) {
          throw error
        }
 
        setPosts(data)

      } catch(error) {
        setError(error)
      } finally {
        setLoading(false)
      }
      
    }

    fetchPosts()

  }, [orderBy])
  

  function handleSortChange(event) {
    setOrderBy(event.currentTarget.value)
  }



  const postElements = posts
    .filter(function(post) {
      if (searchInput) {
        return post.title.toLowerCase().includes(searchInput.toLowerCase())
      } else {
        return post
      }
    })
    .filter(function(post) {
      if (typeFilter) {
        return post.post_type.toLowerCase() === typeFilter.toLocaleLowerCase()
      } else {
        return post
      }
    })
    .map(function(post) {
      return (
        <PostCard 
          key={post.id}
          postObj={post}
        />
      )
    })

  


  return (
    <section className='feeds-section'>
      <h2 className='feeds-section-title'>Explore Posts</h2>

      {loading && (
        <p aria-live="polite">
          Loading...
        </p>
      )}

      {error && (
        <p role="alert">
          Error fetching posts: {error.message}
        </p>
      )}

      {!loading && !error && posts.length === 0 && (
          <p>
              No posts yet. Be the first to start a conversation!
          </p>
      )}


      {!loading && !error && posts.length > 0 && (
        <>
          <div className='sort-buttons-outer-container'>
            <div className='sort-buttons-inner-container'>

              <p>Order by:</p>
              <div className='sort-buttons-container'>
                <button
                  value='created_at'
                  onClick={handleSortChange}
                  className={`sort-button ${orderBy === 'created_at' ? 'selected' : ''}`}
                >
                  Newest
                </button>

                <button
                  value='upvotes'
                  onClick={handleSortChange}
                  className={`sort-button ${orderBy === 'upvotes' ? 'selected' : ''}`}
                >
                  Most Popular
                </button>
              </div>

            </div>

            <div className='sort-buttons-inner-container'>

              <p>Filter by type:</p>
              <div className='filter-buttons-container'>
                <button 
                  className={`filter-button ${!typeFilter ? 'selected' : ''}`}
                  onClick={() => setSearchParams({})}
                >
                  All
                </button>

                <button 
                  className={`filter-button ${typeFilter === 'question' ? 'selected' : ''}`}
                  onClick={() => setSearchParams({type: 'question'})}
                >
                  Question
                </button>

                <button 
                  className={`filter-button ${typeFilter === 'resources' ? 'selected' : ''}`}
                  onClick={() => setSearchParams({type: 'resources'})}
                >
                  Resources
                </button>

                <button 
                  className={`filter-button ${typeFilter === 'discussion' ? 'selected' : ''}`}
                  onClick={() => setSearchParams({type: 'discussion'})}
                >
                  Discussion
                </button>
              </div>

            </div>
          </div>

          <div className='post-list'>
            {postElements}
          </div>
        </>
      )}

      {!loading && !error && posts.length > 0 && postElements.length === 0 && (
          <p>
              No posts found. Try changing your search or filter!
          </p>
      )}
    </section>
  )
}

