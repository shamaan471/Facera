import { firebase } from '../../constants/Config';

export const SET_FRIENDS = 'SET_FRIENDS';


var myDB = firebase.firestore();

// export const fetchProducts = (userId) => {
//     return async (dispatch, getState) => {
//       // any async code you want!
//       const userId = getState().auth.userId;
//       try {
//         const response = await fetch(
//           'https://ng-prj-test.firebaseio.com/products.json'
//         );
  
//         if (!response.ok) {
//           throw new Error('Something went wrong!');
//         }
  
//         const resData = await response.json();
//         const loadedProducts = [];
  
//         for (const key in resData) {
//           loadedProducts.push(
//             new Product(
//               key,
//               resData[key].ownerId,
//               resData[key].title,
//               resData[key].imageUrl,
//               resData[key].description,
//               resData[key].price
//             )
//           );
//         }
  
//         dispatch({
//           type: SET_PRODUCTS,
//           products: loadedProducts,
//           userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
//         });
//       } catch (err) {
//         // send to custom analytics server
//         throw err;
//       }
//     };
// };

export const fetchFriends = (userId) => {
    return dispatch => {
        //var myDB = firebase.firestore();
        const myArr = [];
        myDB
        .collection("users")
        .doc(userId)
        .collection("Friends")
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                //console.log(doc.id, " => ", doc.data()['Name']);
                const myObj = {};
                myObj['name'] = doc.data()['Name'];
                myObj['id'] = doc.data()['id'];
                myArr.push(myObj);
            });
            
            dispatch({type: SET_FRIENDS, friendsList: myArr});
            
        }).catch(error => {
            console.log("Error getting document: ", error);
        });
    };
};


// export const fetchFriends = (userId) => {
//     return dispatch => {
//         console.log("we are in fetchFriends()");
//         dispatch(console.log("we are in fetchFriends()"));
//         //dispatch({type: SET_FRIENDS, friendsList: []})
//     };
// };