import React, {useState, useEffect, useCallback} from 'react'
import { View, ScrollView, StyleSheet, ActivityIndicator , Text, FlatList, TouchableOpacity} from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import * as friendsActions from '../store/actions/friends';
import Colors from '../constants/Colors';
import ListItemName from '../components/UI/ListItemName';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { firebase } from '../constants/Config';


//const myDB = firebase.firestore();



const HomePageScreen = props => {

  const [searchText , setSearchText] = useState('');
  const [searchBarItems, setSearchBarItems] = useState([]);

  const friendsList = useSelector(state => state.friend.friendsList);
  const user = useSelector(state => state.auth.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  

  const [myDB, setMyDB] = useState();


  useEffect( () => {
    setMyDB(firebase.firestore());
  }, [setMyDB, myDB]);
  
  const dispatch = useDispatch();


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


  // //to run when the user inputs a name to the search bar
  // const onSearchBarChangeTextHandler = useCallback(
  //   (text) => async() => {
  //     //go to db and fetch emails and ids
  //     console.log(text);
  //   }
  // , []);

  const onSearchBarChangeTextHandler = async(text) => {
    //search the user
    await myDB
      .collection("users")
      .where("email","==", text)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.id, " => ", doc.data());
          const myObj = {};
          myObj['name'] = doc.data()['fullname'];
          myObj['id'] = doc.data()['id'];
          searchBarItems.push(myObj);
        });

        // dispatch({ type: SET_FRIENDS, friendsList: myArr });

      }).catch(error => {
        console.log("Error getting document: ", error);
      });

    console.log(text);
  }

  const onSearchBarItemSelect = useCallback(
    (item) => async() => {
      //add the selected user as frind
    }
  , [searchBarItems]);


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
      <SearchableDropdown
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
      /> 



      <ScrollView>
        {

        <FlatList
          data={friendsList}
          // renderItem={renderItem}
          keyExtractor={item => item.id}sc
          renderItem = { itemData => (
            <ListItemName style = {styles.item} onSelect = {() => {selectPersonHandler(user, itemData.item.id)}}>
              <Text style = {styles.title}>{itemData.item.name}</Text>
            </ListItemName>
          )}
        /> 
        }
      </ScrollView>
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
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
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
  }
});

export const screenOptions = {
  headerTitle: 'Home'
};


// export const screenOptions = navData => {
//   return {
//     headerTitle: 'Home Page',
//     // headerLeft: () => (
//     //   <HeaderButtons HeaderButtonComponent={HeaderButton}>
//     //     <Item
//     //       title="Menu"
//     //       iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
//     //       onPress={() => {
//     //         navData.navigation.toggleDrawer();
//     //       }}
//     //     />
//     //   </HeaderButtons>
//     // ),
//     headerRight: () => (
//       <HeaderButtons HeaderButtonComponent={HeaderButton}>
//         <Item
//           title="Cart"
//           iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
//           onPress={() => {
//             navData.navigation.navigate('Cart');
//           }}
//         />
//       </HeaderButtons>
//     )
//   };
// };


export default HomePageScreen;