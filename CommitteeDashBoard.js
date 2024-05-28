import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config'; // Ensure this URL is correct

const CommitteeMemberDashboard = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [MeritBaseShortListing, setMeritBaseShortListing] = useState([]);
  const [filteredMeritBaseShortListing, setFilteredMeritBaseShortListing] = useState([]);
  const [profileId , setProfileId] = useState(null);

  useEffect(() => {
    getStoredProfileId(); // Fetch profileId from AsyncStorage
  }, []);

  useEffect(() => {
    fetchData(); // Fetch data initially
  }, [profileId]); // Fetch data whenever profileId changes

  useEffect(() => {
    filterData(); // Filter data whenever searchQuery changes
  }, [searchQuery]);

  const getStoredProfileId = async () => {
    try {
      const storedProfileId = await AsyncStorage.getItem('profileId');
      if (storedProfileId !== null) {
        setProfileId(storedProfileId);
        fetchData(storedProfileId); // Call fetchData with the storedProfileId
      } else {
        console.log('Profile ID not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving profile ID from AsyncStorage:', error);
    }
  };
  
  const fetchData = async (profileId) => {
    try {
      const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Committee/GetApplication?id=${profileId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data); // Check the fetched data
        
        setFilteredMeritBaseShortListing(data);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const filterData = () => {
    if (searchQuery.trim() === '') {
      setFilteredMeritBaseShortListing(MeritBaseShortListing);
    } else {
      const filtered = MeritBaseShortListing.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.arid_no.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMeritBaseShortListing(filtered);
    }
  };

  const handleApplicationClick = async (item) => {
    try {
      await AsyncStorage.setItem('selectedApplication', JSON.stringify(item));
     // props.navigation.navigate('ViewApplication', { applicationData: item });
      console.log('Stored data:', item); // Log the stored data to console
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const renderFacultyMember = ({ item }) => (
    <View style={styles.facultyMemberContainer}>
      <View>
        {item.name && <Text style={styles.facultyMemberName}>{item.name}</Text>}
        {item.arid_no && <Text style={styles.aridNoText}>{item.arid_no}</Text>}
        <TouchableOpacity onPress={() => handleApplicationClick(item)}>
          <Text style={styles.Text}>Click Here To See The Application</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleHeaderPress = () => {
    console.log(MeritBaseShortListing); // Log the data to the console
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name} onPress={handleHeaderPress}>Committee Dash Board</Text>
      </View>
      <View style={styles.frombox}>
        <Text style={styles.wel}>Application Left</Text>
        <Text style={styles.nam}>{filteredMeritBaseShortListing.length}</Text>
      </View>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={filteredMeritBaseShortListing}
        renderItem={renderFacultyMember}
        keyExtractor={(item, index) => item.applicationID.toString()} // Assuming applicationID is a unique identifier
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#82b7bf',
    paddingHorizontal: 20,
    paddingTop: 20,
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
  wel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    marginLeft: 20,
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
    height: 80,
    width: '70%',
    borderBottomWidth: 1,
    marginBottom: 10,
    borderRadius: 30,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
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
  searchBar: {
    flex: 1,
    height: 40,
    color: 'black',
  },
  facultyMemberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    padding: 10,
  },
  facultyMemberName: {
    fontSize: 20,
    color: 'green',
    marginBottom: 5,
  },
  aridNoText: {
    fontSize: 20,
    color: 'gray',
  },
  Text: {
    fontSize: 16,
    color: 'blue',
  },
});

export default CommitteeMemberDashboard;