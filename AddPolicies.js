import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';

const Policies = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [Policies, setPolicies] = useState([
    

  { id: 1, name: 'About University Policies: A student can avail only one scholarship at a time.' },
     { id: 2, name: 'Another policy or note here.' },
     { id: 3, name: 'About University Policies: A student can avail only one scholarship at a time.' },
     { id: 4, name: 'About University Policies: A student can avail only one scholarship at a time.' },
     { id: 5, name: 'About University Policies: A student can avail only one scholarship at a time.' },
     { id: 6, name: 'About University Policies: A student can avail only one scholarship at a time.' },
     { id: 7, name: 'About University Policies: A student can avail only one scholarship at a time.' },
     { id: 8, name: 'About University Policies: A student can avail only one scholarship at a time.' },
  ]);

  const renderPolicy = ({ item }) => {
    if (item.category === 'heading') {
      return (
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>{item.name}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.policyContainer}>
          <Text style={styles.policyText}>{item.name}</Text>
        </View>
      );
    }
  };

  const handleAddIconPress = () => {
    // Handle add icon press action
    props.navigation.navigate('ADDPolicies');
  };

  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>POLICIES</Text>
        <TouchableOpacity onPress={handleAddIconPress}>
          <Image source={require('./Add.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.frombox}>
        <Text style={styles.wel}>Apply Before</Text>
        <Text style={styles.nam}>11-MAY-2024</Text>
        
      </View>
      <View style={styles.searchBarContainer}>
        <Image source={require('./Search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search Policies"
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView>
        <FlatList
          data={Policies}
          renderItem={renderPolicy}
          keyExtractor={(item) => item.id.toString()}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#82b7bf',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingVertical: 1,
    color: 'red',
    fontSize: 24,
    marginTop: 10,
  },
  horizontalLine: {
    backgroundColor: 'black',
    height: 2,
    width: '100%',
    marginTop: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    color: 'black',
  },
  policyContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  policyText: {
    fontSize: 18,
    color: 'black',
  },
  headingContainer: {
    backgroundColor: 'lightgray',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  frombox: {
    backgroundColor: '#fff',
    padding: 20,
    height:100,
    width:320,
    borderBottomWidth: 1,
    marginBottom: 10,
    borderRadius: 30,
    marginTop:10,
  },
  wel: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    marginLeft:20
  },
  nam: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red',
    textAlign: 'center',
  },
});

export default Policies;
