import { firebase } from '../../constants/Config';

export const SET_FRIENDS = 'SET_FRIENDS';


var myDB = firebase.firestore();



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