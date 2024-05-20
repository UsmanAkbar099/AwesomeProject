import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';

const FacultyMember = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyMembers, setFacultyMembers] = useState([
    { id: 1, name: 'Usman Akbar', image: require('./logo.png') },
    { id: 2, name: 'Abdul Islam', image: require('./logo.png') },
    // Add more faculty members here
  ]);

  const renderFacultyMember = ({ item }) => (
    <View style={styles.facultyMemberContainer}>
      <View style={styles.facultyMemberInfo}>
        <Text style={styles.facultyMemberName}>{item.name}</Text>
      </View>
      <Image source={item.image} style={styles.facultyMemberImage} />
    </View>
  );

  const handleAddIconPress = () => {
    // Handle add icon press action
    props.navigation.navigate('AddFacultyMembers');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>Faculty MEMBERS</Text>
        <TouchableOpacity onPress={handleAddIconPress}>
          <Image source={require('./Add.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.searchBarContainer}>
        <Image source={require('./Search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search Faculty Members"
          placeholderTextColor="black" // Set placeholder text color to black
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={facultyMembers}
        renderItem={renderFacultyMember}
        keyExtractor={(item) => item.id.toString()}
      />
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
    marginBottom: 60,
    marginTop: 20, // Adjusted top margin
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
  facultyMemberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    padding: 10,
  },
  facultyMemberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facultyMemberImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Round shape
    marginRight: 10,
  },
  facultyMemberName: {
    fontSize: 18,
    color: 'black',
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginTop: 10,
  },
});

export default FacultyMember;
