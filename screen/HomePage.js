import React, {useState} from 'react'
import { SearchBar } from 'react-native-elements';


const HomePageScreen = props => {

  const [search , setSearch] = useState('');

  const searchHandler = text => {
    setSearch(text);
  };

  return (
    <SearchBar
      placeholder="Type Here..."
      onChangeText={searchHandler}
      value={search}
    />
  );

};


export const screenOptions = {
  headerTitle: 'Home'
};

export default HomePageScreen;