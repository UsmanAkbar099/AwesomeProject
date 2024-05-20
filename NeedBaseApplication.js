import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const NeedBaseApplication = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [MeritBaseShortListing, setMeritBaseShortListing] = useState([
    { id: 1, name: 'Usman Akbar', aridNo: '2020-ARID-4236' },
    { id: 2, name: 'Abdul Islam', aridNo: '2020-ARID-3777' },
    { id: 3, name: 'M Amir Shahzad', aridNo: '2020-ARID-3690' },
    { id: 4, name: 'M Bashir', aridNo: '2020-ARID-3777' },
    // Add more faculty members here
  ]);

  const applicationCount = MeritBaseShortListing.length;

  const renderFacultyMember = ({ item }) => (
    <View style={styles.facultyMemberContainer}>
      <View>
        <Image source={require('./Search.png')} style={styles.searchIcons} />
        <Text style={styles.facultyMemberName}>{item.name}</Text>
        <Text style={styles.aridNoText}>{item.aridNo}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>Need Base Application</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.frombox}>
        <Text style={styles.wel}>Application Left</Text>
        <Text style={styles.nam}>
    <Text>{applicationCount}</Text> {/* Wrap applicationCount with Text component */}
  </Text>
      </View>
      <View style={styles.searchBarContainer}>
        <Image source={require('./Search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
        <FlatList
          data={MeritBaseShortListing}
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
  wel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    marginLeft: 20
  },
  nam: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'gray',
    textAlign: 'center',
  },
  frombox: {
    backgroundColor: '#fff',
    padding: 20,
    height: 80, // Adjust the height as needed
    width: '70%', // Adjust the width as needed
    borderBottomWidth: 1,
    marginBottom: 10,
    borderRadius: 30,
    marginTop: 10,
    alignItems: 'center', // Align center horizontally
    justifyContent: 'center', // Align center vertically
    alignSelf: 'center', // Center the container itself
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  searchIcons: {
    width: '70%',
    height: undefined, // Set height to undefined to maintain aspect ratio
    aspectRatio: 1, // Set aspect ratio to 1 to maintain square shape
    resizeMode: 'contain', // Ensure image fits within its container
  },
  searchBar: {
    flex: 1,
    height: 40,
    color: 'black',
  },
  facultyMemberContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center items horizontally
    alignItems: 'center', // Center items vertically
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    padding: 10,
  },
  facultyMemberName: {
    fontSize: 20,
    color: 'black',
    marginBottom: 5,
  },
  aridNoText: {
    fontSize: 16,
    color: 'gray',
  },
  input: {
    backgroundColor: '#ffffff',
    color: 'black', // Set text color to black
    borderRadius: 10,
    width: '90%',
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  inputs: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingVertical: 1,
    color: 'black',
    fontSize: 18,
    paddingHorizontal: 10,
    marginBottom: 2,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 10,
  },
  pickerContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NeedBaseApplication;
