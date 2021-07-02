import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Auth } from 'aws-amplify';
import { client } from '../../graphql';
import { setAuthUser, initialAuthUser, unsetAuthUser } from '../../redux/actions/auth';
// import { useInitialUser } from '../users';
export { useSignIn } from './signIn';
export { useSignUp } from './signUp';
export { useForgetPassword } from './forgetPassword';
export { useVerifyEmail } from './verifyEmail';

export function useHandleLogout() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    Auth.signOut().then(async () => {
      client.resetStore();
      dispatch(unsetAuthUser());
    });
  };
  return { handleLogout };
}

export function useCurrentAuthenticatedUser() {
  const dispatch = useDispatch();
  // useInitialUser();

  const getUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        const payload = {
          attributes: user.attributes,
          admin: user.signInUserSession.accessToken.payload['cognito:groups']
            ? user.signInUserSession.accessToken.payload['cognito:groups'].indexOf('superadmin') >
              -1
            : false,
        };
        dispatch(setAuthUser(payload));
        return user.attributes;
      }
    } catch (error) {
      dispatch(initialAuthUser());
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return { getUser };
}
