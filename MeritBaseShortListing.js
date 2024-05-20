import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const MeritBaseShortListing = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [MeritBaseShortListing, setMeritBaseShortListing] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.47.189/FinancialAidAllocation/api/Admin/MeritBaseShortListing');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
  
        setMeritBaseShortListing(data);
        setFilteredData(data); // Set filtered data initially
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  const filterData = (query) => {
    // Check if MeritBaseShortListing is not empty
    if (MeritBaseShortListing.length > 0) {
      const filtered = MeritBaseShortListing.filter((item) =>
        item.s.arid_no.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  
  
  

  const renderFacultyMember = ({ item }) => (
    <View style={styles.facultyMemberContainer}>
      <View>
        <Text style={styles.facultyMemberName}>{item.s.name}</Text>
        <Text style={styles.aridNoText}>{item.s.arid_no}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => handleAddButtonPress(item)}>
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>Accept</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRejectButtonPress(item.id)}>
          <View style={styles.rejectButton}>
            <Text style={styles.rejectButtonText}>Reject</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  
  const handleAddButtonPress = (item) => {
    // Accessing id from nested properties
    const facultyId = item.m.id || item.s.student_id;
    console.log('Accept button pressed for faculty with ID:', facultyId);
  };
  
  const handleRejectButtonPress = (facultyId) => {
    console.log('Reject button pressed for faculty with ID:', facultyId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>Merit Base Short Listing</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.searchBarContainer}>
        <Image source={require('./Search.png')} style={styles.searchIcon} />
        <TextInput
  style={styles.searchBar}
  placeholder="ARID NO#"
  placeholderTextColor="black"
  value={searchQuery}
  onChangeText={(text) => {
    setSearchQuery(text);
    filterData(text);
  }}
/>

      </View>
      
      
      {MeritBaseShortListing.length === 0 ? (
  <Text>Loading...</Text>
) : (
  <FlatList
  data={filteredData}
  renderItem={renderFacultyMember}
  keyExtractor={(item, index) => (item.id !== undefined ? item.id.toString() : index.toString())}
/>


)}


      
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
  facultyMemberName: {
    fontSize: 20,
    color: 'black',
    marginBottom: 5,
  },
  aridNoText: {
    fontSize: 16,
    color: 'gray',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rejectButton: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  rejectButtonText: {
    color: 'white',
    fontWeight: 'bold',
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

export default MeritBaseShortListing;
