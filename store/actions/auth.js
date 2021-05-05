export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

import { firebase } from '../../constants/Config';

export const authenticate = (userId, token, fullName) => {
    return dispatch => {
      //dispatch(setLogoutTimer(expiryTime));
      dispatch({ type: AUTHENTICATE, userId: userId, token: token});
    };
};
  


export const signup = (username, fullname, email, password) => {
  return async dispatch => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid
        const data = {
          id: uid,
          email,
          username,
          fullname          
        };
        const usersRef = firebase.firestore().collection('users')
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            //navigation.navigate('Home', { user: data })
            dispatch(
              authenticate(
                response.localId,
                response.idToken,
                //parseInt(resData.expiresIn) * 1000
              )
            );//-
          })
          .catch((error) => {
            alert(error)
          });
      })
      .catch((error) => {
        alert(error)
      });
  }

}

export const login = (email, password) => {
    return async dispatch => {
      const response = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDLNKHaqVg-cCkmOE8JZ8tiXLKoLSmGWJw',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
          })
        }
      );
  
      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = 'Something went wrong!';
        if (errorId === 'EMAIL_NOT_FOUND') {
          message = 'This email could not be found!';
        } else if (errorId === 'INVALID_PASSWORD') {
          message = 'This password is not valid!';
        }
        throw new Error(message);
      }
  
      const resData = await response.json();
      console.log(resData);
      dispatch(
        authenticate(
          resData.localId,
          resData.idToken,
          //parseInt(resData.expiresIn) * 1000
        )
      );
      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000
      );
      //saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};

export const logout = () => {
  return { type: LOGOUT };
};
  