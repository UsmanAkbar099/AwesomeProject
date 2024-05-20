import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';

const CommitteeMember = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [filteredFacultyMembers, setFilteredFacultyMembers] = useState([]);

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        // Make API call to fetch data
        const response = await fetch('http://192.168.47.189/FinancialAidAllocation/api/Admin/CommitteeMembers');
        const data = await response.json();
        // Set the fetched data to state
        setFacultyMembers(data);
        setFilteredFacultyMembers(data); // Set filtered data initially same as the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetch data function
    fetchData();
  }, []); // Empty dependency array to run effect only once when component mounts

  useEffect(() => {
    // Function to filter faculty members based on search query
    const filterFacultyMembers = () => {
      const filtered = facultyMembers.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFacultyMembers(filtered);
    };

    // Call the filter function when searchQuery changes
    filterFacultyMembers();
  }, [searchQuery, facultyMembers]);

  const renderFacultyMember = ({ item }) => (
    <View style={styles.facultyMemberContainer}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.facultyMemberImage} />
      ) : (
        <Image source={require('./logo.png')} style={styles.facultyMemberImage} />
      )}
      <View style={styles.facultyMemberInfo}>
        <Text style={styles.facultyMemberName}>{item.name}</Text>
        <TouchableOpacity onPress={() => handleAddButtonPress(item.id)}>
          <View style={styles.removeButton}>
            <Text style={styles.addButtonText}>Remove</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleAddButtonPress = (facultyId) => {
    // Handle add button press action for the specific faculty member
    console.log('Remove button pressed for faculty with ID:', facultyId);
  };

  const handleAddIconPress = () => {
    // Handle add icon press action
    props.navigation.navigate('AddCommitteeMember');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}> Committee Members</Text>
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
          data={filteredFacultyMembers}
          renderItem={renderFacultyMember}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
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
    marginBottom: 20, // Adjusted marginBottom
    marginTop: 20, // Adjusted marginTop
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
  icon: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginTop: 10,
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
    flex: 1, // Added flex property
    justifyContent: 'space-between', // Added justifyContent property
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
    // Removed marginRight to prevent overflow
  },
  removeButton: {
    backgroundColor: 'red',
    paddingHorizontal: 17, // Increased horizontal padding
    paddingVertical: 10, // Increased vertical padding
    borderRadius: 15,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CommitteeMember;
