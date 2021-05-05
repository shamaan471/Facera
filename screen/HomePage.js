import React, {useState, useEffect, useCallback} from 'react'
import { View, ScrollView, StyleSheet, ActivityIndicator , Text, FlatList, TouchableOpacity,Button} from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import * as friendsActions from '../store/actions/friends';
import Colors from '../constants/Colors';
import ListItemName from '../components/UI/ListItemName';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { firebase } from '../constants/Config';
import { Searchbar } from 'react-native-paper';
import Card from '../components/UI/Card';
import { AntDesign } from '@expo/vector-icons';
import { Button as ElButton} from 'react-native-elements';


const myDB = firebase.firestore();



const HomePageScreen = props => {

  //realting to search bar and queires
  const searchText = useState('');
  const [searchBarItems, setSearchBarItems] = useState([]);

  const friendsList = useSelector(state => state.friend.friendsList);
  const user = useSelector(state => state.auth.userId);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  
  //will be dispatching action in the future
  const dispatch = useDispatch();

  //const [myDB, setMyDB] = useState();

  //establish connection with the database and get the user name
  // useEffect( () => {
  //   setMyDB(firebase.firestore());
  // }, [setMyDB]);

  useEffect( () => {
    myDB
    .collection('users')
    .doc(user)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data()['fullname']); //store
        setUserName(doc.data()['fullname']);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  }, [setUserName]);
  


  const searchHandler = text => {
    setSearch(text);
  };


  //function to fetch the friends list from the store
  const loadFriends = useCallback(
    async() => {
      setIsLoading(true);
      
      try{
        await dispatch(friendsActions.fetchFriends(user));

      }catch (err) {
        setError(err.message)
      }
      setIsLoading(false);
  },
  [dispatch, setIsLoading]);


  const selectPersonHandler = (userId, friendId) => {
    //generating distinct chat id for the chat room between these friends
    const chatterId = userId;
    const chateeID = friendId;
    const chatIDpre = [];
    chatIDpre.push(chatterId);
    chatIDpre.push(chateeID);
    chatIDpre.sort();
    const distinctChatId= chatIDpre.join('_');

    props.navigation.navigate('ChatRoom', {
      currUserId: userId,
      friendId: friendId,
      chatId : distinctChatId
    });
     };

 


  const onSearchBarChangeTextHandler = async(text) => {
    //search the user
    await myDB
      .collection("users")
      .where("email","==", text)
      .get()
      .then(querySnapshot => {
        const myArr = [];
        querySnapshot.forEach(doc => {
          //console.log(doc.id, " => ", doc.data());
          const myObj = {};
          myObj['name'] = doc.data()['fullname'];
          myObj['id'] = doc.data()['id'];
          //searchBarItems.push(myObj);
          myArr.push(myObj);
          setSearchBarItems(myArr);

        });

        // dispatch({ type: SET_FRIENDS, friendsList: myArr });

      }).catch(error => {
        console.log("Error getting document: ", error);
      });
  }


  //add the clicked person to friend
  const onSearchBarItemSelect =  async (userId, userName, friendId, friendName) => {
    await myDB.collection('users').doc(userId).collection('Friends').doc(friendId).set({
      Name: friendName,
      id: friendId
    });
      
      
    await myDB.collection('users').doc(friendId).collection('Friends').doc(userId).set({
      Name: userName,
      id: userId
    }); 
    
    await dispatch(friendsActions.fetchFriends(user));
    setSearchBarItems([]);
  };

  const profilePageHandler = () => {
    props.navigation.navigate('Profile');
  }


  //runs on every rerender and calls func to fetch the friends
  useEffect(() => {
    setIsLoading(true);
    loadFriends().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadFriends]);
  
  if (isLoading){
    return(
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }
  return (
    <View style={styles.screen}>
      {/* <SearchableDropdown
        onTextChange={(text) => {onSearchBarChangeTextHandler(text)}}
        onItemSelect={(item) => {onSearchBarItemSelect(item)}}
        //onItemSelect={(item) => alert(JSON.stringify(item))}
        containerStyle= {styles.textContainer}
        textInputStyle={styles.textInput}
        itemStyle={styles.searchBarItemStyle}
        itemTextStyle={styles.searchBarItemText}
        itemsContainerStyle={styles.searchBarItemContainer}
        items={searchBarItems}
        defaultIndex={2}
        placeholder="please type email of the user"
        resetValue={false}
        //reset textInput Value with true and false state
        underlineColorAndroid="transparent"
        //To remove the underline from the android input
      />  */}

      <Button style={{color: "65BE69", margin: 10}}
        onPress={() => profilePageHandler()}
        title="Profile"
      />
      <Searchbar
        placeholder="Enter an email adress..."
        onChangeText = {(searchText) => {onSearchBarChangeTextHandler(searchText)}}
        value={searchText}
      />
 
      <Text style={styles.textBar}
      
      >{"Search Results"}</Text>
      <Card style={styles.resultContainer}>
      <FlatList
        data={searchBarItems}
        // renderItem={renderItem}
        keyExtractor={item => item.name}
        renderItem = { itemData => (
          <ListItemName style = {styles.item} onSelect = {() => {onSearchBarItemSelect(user, userName, itemData.item.id, itemData.item.name)} }>
            <Text style = {styles.title}>{itemData.item.name}</Text>
          </ListItemName>
        )}
      /> 
        </Card>

      <Text style={styles.textBar}>{"Friends List"}</Text>
      <FlatList
        data={friendsList}
        // renderItem={renderItem}
        keyExtractor={item => item.id}
        renderItem = { itemData => (
          <ListItemName style = {styles.item} onSelect = {() => {selectPersonHandler(user, itemData.item.id)}}>
            <Text style = {styles.title}>{itemData.item.name}</Text>
          </ListItemName>
        )}
      /> 
        
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center'
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: {
    backgroundColor: '#C9E0AF',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
  },
  textContainer: {
    padding: 5
  },

  textInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#FAF7F6',
  },

  searchBarItemStyle: {
    padding: 10,
    marginTop: 2,
    backgroundColor: '#FAF9F8',
    borderColor: '#bbb',
    borderWidth: 1,
  },

  searchBarItemText: {
    color: '#222',
  },

  searchBarItemContainer: {
    maxHeight: '60%',
  },

  textBar: {
    fontWeight: 'bold',
    color: '#085A2E',
    fontSize: 20,
    margin: 10
  },
  resultContainer: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

// export const screenOptions = {
//   headerTitle: 'Home',
//   headerTintColor: '#013220',
//   headerTitleStyle: {
//         fontWeight: 'bold',
//   },
// };

export const screenOptions = navData => {
  return {
    headerTitle: 'Home',
    headerTintColor: '#013220',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerRight: () => (
        <ElButton
            onPress = {() => navData.navigation.navigate('AvatarScreen')}
            type = "clear"
            icon={<AntDesign  name={'smileo'} size={30} color={'#075e1e'} />}
        />
    )
  }
};


export default HomePageScreen;