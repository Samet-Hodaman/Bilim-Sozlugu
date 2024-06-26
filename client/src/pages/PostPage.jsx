import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Spinner } from 'flowbite-react'
import CallToAction from '../components/CallToAction'
import CommentSection from '../components/CommentSection'
import PostCard from '../components/PostCard'

export default function PostPage() {
  const { postSlug, commentId } = useParams()
  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState(false)
  const [ post, setPost ] = useState(null)
  const [ recentPosts, setRecentPosts ] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
        const data = await res.json()
        
        if (res.ok){
          setPost(data.posts[0])
          setError(false)
        } else {
          setError(true)
        }
        setLoading(false)
      } catch (error) {
        console.log(error.message);
      }
    }
  fetchPost()
  },[postSlug])

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`)
        const data = await res.json()
        if (res.ok) {
          setRecentPosts(data.posts)
        }
      }

      fetchRecentPosts()
    } catch (error) {
      console.log(error.message);
    }
  }, [])

  useEffect(() => {
    const scrollToComment = () => {
      if (commentId && !loading) {
        setTimeout(() => {
          if (commentId){
            const targetElement = document.getElementById(commentId)
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
              targetElement.classList.add('bg-blue-200','transition','duration-700','ease-in-out','rounded-lg')
              setTimeout(() => {
                targetElement.classList.remove('bg-blue-200');
              }, 800);
            }
          }
        }, 300)
      } 
    }

    if (!loading ) { scrollToComment() } }, [commentId, loading])

  if (loading) { return (
    <div className='flex justify-center items-center min-h-screen'>
      <Spinner size='xl' />
    </div>
  )}
  
  return (
  <main className='lg:text p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
    <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
      {post && post.title}
    </h1>
    {/** Category section */}
    <Link 
      to={`/search?category=${post && post.category}`}
      className='self-center mt-5'
    >
      <Button color='gray' pill size='xs'>{post && post.category}</Button>
    </Link>
    {/** */}
    {/** Image section */}
    <img 
      src={post && post.image} 
      alt={post && post.title} 
      className='mt-10 p-3 max-h-[600px] w-full object-cover'
    />
    <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
      <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
      <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
    </div>
    {/** */}
    {/** Content Text section */}
    <div 
      className='p-3 max-w-5xl mx-auto w-full post-content text-indent !dark:text-white' 
      dangerouslySetInnerHTML={{__html: post && post.content}}   
    />
    {/** */}
    <Link
      to={`/search?author=${post && post.author}`}
      className='flex w-full gap-1 p-3 items-center justify-end '>
      <span className='text-sm'>Yazar:</span>
      <Button color='gray' className='border-none' pill size='xs'>{post && post.author}</Button>
    </Link>

    <div className='max-w-4xl mx-auto w-full'>
      <CallToAction />
    </div>
    <CommentSection postId={post._id} />

    <div className='flex flex-col justify-center items-center mb-5'>
      <h1 className='text-xl mt-5'>Son paylaşımlar</h1>
      <div className='flex flex-wrap gap-5 mt-5 justify-center'>
        {
          recentPosts &&
            recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
        }
      </div>
    </div>
  </main>
  )
}
