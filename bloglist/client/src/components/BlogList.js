import Blog from './Blog'

const BlogList = ({ blogs }) => {
    return (
        <div>
            {blogs
                .sort((a, b) => b.likes - a.likes)
                .map(blog => (
                    <Blog
                        key={blog.id}
                        blog={blog}
                    />
                ))}
        </div>
    )
}

export default BlogList
