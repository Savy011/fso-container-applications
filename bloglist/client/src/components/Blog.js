import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
    return (
        <div className="blog">
            <div className="blog-title">
                <Link to={`/blogs/${blog.id}`}>
                    <i>{blog.title}</i> - {blog.author}
                </Link>
            </div>
        </div>
    )
}

export default Blog
