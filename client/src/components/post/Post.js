import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import {getPost} from '../../actions/post';
import {Link} from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = ({getPost, post: {post, isLoading}, match}) => {
  useEffect (() => {
    getPost (match.params.id);
  }, getPost);

  return isLoading || post === null
    ? <Spinner />
    : <Fragment>
        <Link to="/posts" className="btn">Back To Posts</Link>
        {post.map (post => (
          <PostItem key={post._id} post={post} showActions={false} />
        ))}
        {post.map (post => <CommentForm key={post._id} postId={post._id} />)}
        <div className="comments">post.comments.map(comment => (
          <CommentItem key={Comment._id} Comment ={Comment} postId = {post._id} />
        ))</div>
      </Fragment>;
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  post: state.post,
});

export default connect (mapStateToProps, {getPost}) (Post);
