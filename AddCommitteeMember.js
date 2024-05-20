import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';

const AddCommitteeMember = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyMembers, setFacultyMembers] = useState([
    { id: 1, name: 'Usman Akbar', image: require('./logo.png') },
    { id: 2, name: 'Abdul Islam', image: require('./logo.png') },
    // Add more faculty members here
  ]);

  const renderFacultyMember = ({ item }) => (
    <View style={styles.facultyMemberContainer}>
      <Image source={item.image} style={styles.facultyMemberImage} />
      <View style={styles.facultyMemberInfo}>
        <Text style={styles.facultyMemberName}>{item.name}</Text>
        <TouchableOpacity onPress={() => handleAddButtonPress(item.id)}>
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>ADD</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleAddButtonPress = (facultyId) => {
    // Handle add button press action for the specific faculty member
    console.log('Add button pressed for faculty with ID:', facultyId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>Add Committee Members</Text>
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
    fontSize: 20,
    color: 'black',
    marginRight:80
  },
  addButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20, // Increased horizontal padding
    paddingVertical: 10, // Increased vertical padding
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddCommitteeMember;
