import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';

if (typeof window !== 'undefined' && !window.global) {
  window.global = window;
}

const poolData = {
  UserPoolId: 'ap-southeast-1_ekv4BbtBU',
  ClientId: 'fo4hj22n3evq38f5fa7q509t9'
};

const userPool = new CognitoUserPool(poolData);

export const signup = async (name, email, phone_number, password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
  const formattedPhoneNumber = `+91${phone_number}`;

  const attributeList = [
    new CognitoUserAttribute({ Name: 'name', Value: name }),
    new CognitoUserAttribute({ Name: 'email', Value: email }),
    new CognitoUserAttribute({ Name: 'phone_number', Value: formattedPhoneNumber })
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        reject(new Error(err.message || 'Could not sign up user'));
        return;
      }
      if (result) {
        localStorage.setItem('tempEmail', email);
        resolve({
          success: true,
          message: 'User registered successfully!',
          userSub: result.userSub,
          user: result.user
        });
      } else {
        reject(new Error('No result from signup'));
      }
    });
  });
};

export const signin = async (email, password, navigate) => {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    const userData = {
      Username: email,
      Pool: userPool
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        const accessToken = session.getAccessToken().getJwtToken();
        const idToken = session.getIdToken().getJwtToken();
        const refreshToken = session.getRefreshToken().getToken();

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('idToken', idToken);
        localStorage.setItem('refreshToken', refreshToken);

        resolve({
          success: true,
          accessToken,
          idToken,
          message: 'Successfully signed in'
        });

        navigate('/dashboard');
      },
      onFailure: (err) => {
        if (err.code === 'UserNotConfirmedException') {
          localStorage.setItem('tempEmail', email);
          navigate('/verify-email');
          return;
        }
        reject(new Error(err.message || 'Failed to sign in'));
      }
    });
  });
};

export const verifyEmail = async (email, code) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(new Error(err.message || 'Failed to verify email'));
        return;
      }
      if (result === 'SUCCESS') {
        localStorage.removeItem('tempEmail');
        resolve({
          success: true,
          message: 'Email verified successfully',
          verified: true
        });
      } else {
        reject(new Error('Verification failed'));
      }
    });
  });
};

export const resendVerificationCode = async (email) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(new Error(err.message || 'Failed to resend verification code'));
        return;
      }
      resolve({
        success: true,
        message: 'A new verification code has been sent to your email'
      });
    });
  });
};

export const isAuthenticated = () => {
  const currentUser = userPool.getCurrentUser();
  if (!currentUser) return false;

  return new Promise((resolve) => {
    currentUser.getSession((err, session) => {
      if (err) {
        resolve(false);
        return;
      }
      resolve(session.isValid());
    });
  });
};

export const getCurrentUser = () => {
  return userPool.getCurrentUser();
};

export const signOut = () => {
  const currentUser = userPool.getCurrentUser();
  if (currentUser) {
    currentUser.signOut();
  }
  localStorage.clear();
};
