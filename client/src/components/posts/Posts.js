import React, {Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {getPosts} from '../../actions/post'
import Spinner from '../layout/Spinner'
import PostItem from './PostItem'

const Posts = ({ getPosts, post: {posts, isLoading}}) => {

    useEffect(() => {
        getPosts()
    }, [getPosts])

    return (
        isLoading ? <Spinner /> : (<Fragment>
            <h1 className="large text-primary">Posts</h1>
            <p className="lead"> <i className="fas fa-user"/> Welcome to the community </p>
            {/*  Post Form */}
            <div className="posts">
                {posts.map(post => (
                    <PostItem kry={post._id} post={post} />
                ))}
            </div>
        </Fragment>) 
    )
      
    
}

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
}
const mapStateToProps =  state => ({
    post: state.post
})

export default connect(mapStateToProps, {getPosts})(Posts)
