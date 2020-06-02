import React, {useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Link } from "react-router-dom"
import Spinner from '../layout/Spinner';
import {getProfileById} from '../../actions/profile';
import ProfileTop from './ProfileTop.js'
import ProfileAbout from './ProfileAbout.js'

const Profile = ({
  getProfileById,
  profile: {profile, loading},
  auth,
  match,
}) => {
  useEffect (
    () => {
      getProfileById (match.params.id);
    },
    [getProfileById, match.params.id]
  );
  return (
    <Fragment>
      {profile === null || loading ? <Spinner /> : <Fragment>
          <Link to="/profiles" className="btn btn-light"> Back To Profiles</Link>
          {auth.isAuthenticated && !auth.isLoading && auth.user._id === profile.user._id && <Link to="/edit-profile" className="btn btn-dark">Edit Profile </Link> }
          <div className="profile-grid my-1">
            <ProfileTop  profile={profile}/>
            <ProfileAbout  profile={profile}/>
          </div>
        </Fragment>}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProp = state => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect (mapStateToProp, {getProfileById}) (Profile);
