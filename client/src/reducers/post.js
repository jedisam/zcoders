import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POSTS,
    ADD_POST
} from '../actions/types'


const initialState = {
    posts: [],
    post: null,
    isLoading: true,
    error: {}
}

export default (state = initialState, action) => {
    const  { type, payload } = action;

    switch(type) {
        case GET_POSTS:
            return {
                ...state,
                posts: payload,
                isLoading: false
            }
        case ADD_POST:
            return {
                ...state,
                posts: [payload, ...state.posts ],
                isLoading: false
            }
        case DELETE_POSTS:
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== payload),
                isLoading: false
            }
        case POST_ERROR:
            return {
                ...state,
                error: payload,
                isLoading: false
            }
        case UPDATE_LIKES: 
            return{
                ...state,
                posts: state.posts.map(post => post._id === payload.postId ? {...post, likes:payload.likes} : post),
                isLoading: false 
            }
        default:
            return {
                ...state
            }
    }

}