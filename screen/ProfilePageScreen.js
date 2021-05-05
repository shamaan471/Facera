import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { View, SafeAreaView, StyleSheet } from "react-native";
import { firebase } from "../constants/Config";
import { Text, Button, TextInput } from "react-native";
import {  TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from '@expo/vector-icons';


var myDB = firebase.firestore();
const ProfilePageScreen = (props) => {

  const [currentUser, setCurrentUser] = useState([]);
  const [users, setUsers] = useState([]);
  const user = useSelector(state => state.auth.userId);
  //onsole.log(user);

  const editProfilePageHandler = () => {
    props.navigation.navigate("EditProfile");
  };




  useEffect( () => {
    const db = firebase.firestore();
    db
    .collection('users')
    .doc(user)
    .get()
    .then(function(doc) {
      setCurrentUser([...currentUser,doc.data()])
     // console.log(doc.data());
    });
  }, [setCurrentUser]);
  

 

  return (
    <SafeAreaView style={styles.container}>
     
     
        <View style={styles.userInfoSection}>
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            {/* Avatar should be added */}
            <View style={{ marginLeft: 10 }}>
            
            {currentUser.map((current) => (
            <Text key="{current}" style={{fontWeight: 'bold', fontSize: 20}}>{current.fullname}</Text>
            ))}
            <View style={{margin: 20}}>
            {currentUser.map((current) => (
              
              <Text key="{current}" style={{ fontSize: 12}}>Username: {current.username}</Text>
              ))}
              </View>
            </View>
          </View>
        </View>
     

      <View style={styles.userInfoSection}>
        
          <View style={styles.row}>
            <Ionicons name="mail-outline" color="#777777" size={20} />
            {currentUser.map((current) => (
            <Text key="{current}" style={{ color: "#777777", marginLeft: 20 }}>
              {current.email}
            </Text>
             ))}
          </View>
       
      </View>    
       
     

      <View style={styles.menuWrapper}>
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.menuItem}>
            <Ionicons name="heart-outline" color="#FF6347" size={25} />
            <Button style={styles.button} title="Favorite Friends"></Button>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.menuItem}>
            <Ionicons name="create-outline" color="#FF6347" size={25} />
            <Button
              onPress={editProfilePageHandler}
              style={styles.button}
              title="Edit Profile"
            ></Button>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export const screenOptions = {
  headerTitle: "Profile",
  headerTintColor: '#013220',
      headerTitleStyle: {
            fontWeight: 'bold',
          },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
});

export default ProfilePageScreen;




/*


  const getData = async () => {

    fetchUserData();
    try {
      if (!firebase) return;
      const db = firebase.firestore();
      const ref = db.collection("users");

      const docs = await ref.get();
      let foundData = [];

      docs.forEach((doc) => {
        const data = doc.data();
        if (data.email == user.email) {
          foundData.push(data);
          // console.log(foundData)
        }
      });

      setCurrentUser(foundData);
      console.log(currentUser);
    } catch (error) {
      console.log("error", error);
    }
  }

  const fetchUserData = async () => {
    firebase.auth().onAuthStateChanged(function (user) {
      console.log(user);
      if (user) {
        console.log("User email: ", user.email);
        setUser(user);}
    });
  }
// useEffect(() => {
  //   getData();
  // });
*/

  // const getCurrentUserData = async () => {
   
  //   firebase.auth().onAuthStateChanged(async function (user) {
  //     //console.log(user);
  //     // if (user) {
  //     //   console.log("User email: ", user.email);
  //     //  setUser(user);
  //     try {
      
  //     const db = firebase.firestore();
  //     const ref = db.collection("users");

  //     const data = await ref.get();
      
  //     data.forEach(doc=>{
  //       if (doc.data().email) {
  //         setCurrentUser([...currentUser,doc.data()])
  //         console.log(doc.data());
          
  //         console.log(doc.data().email);
  //       }
  //       else {
  //         setUsers([...users,doc.data()])
  //         console.log(users);
  //       }
        
  //      })
     
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  //   //  }
  // });
  // }

  // useEffect(() => {
  //   getCurrentUserData();
  // }, [])