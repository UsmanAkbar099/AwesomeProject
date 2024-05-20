import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet, FlatList, Image } from 'react-native';

const RejectedApplication = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [filteredFacultyMembers, setFilteredFacultyMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from API
    fetchData();
  }, []);

  useEffect(() => {
    // Filter faculty members based on search query
    if (searchQuery.trim() === '') {
      setFilteredFacultyMembers(facultyMembers);
    } else {
      const filteredData = facultyMembers.filter((member) =>
        member.ap.s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFacultyMembers(filteredData);
    }
  }, [searchQuery, facultyMembers]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.47.189/FinancialAidAllocation/api/Admin/RejectedApplication');
      const data = await response.json();
      setFacultyMembers(data);
      setFilteredFacultyMembers(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setError(error);
      setIsLoading(false);
    }
  };

  const renderFacultyMember = ({ item }) => {
    const { ap, f } = item;
    const { s } = ap;
    const { aidtype, applicationStatus } = f;

    return (
      <View style={styles.facultyMemberContainer}>
        <View style={styles.facultyMemberInfo}>
          <Text style={styles.facultyMemberName}>{s.name || 'Unknown'}</Text>
          <Text style={styles.aridNoText}>{s.arid_no || 'N/A'}</Text>
          <Text style={styles.aridNoText}>Aid Type: {aidtype || 'N/A'}</Text>
          <Text style={styles.aridNoText}>Application Status: {applicationStatus || 'N/A'}</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>Rejected Application</Text>
      </View>
      <View style={styles.horizontalLine} />

      <View style={styles.frombox}>
        <Text style={styles.wel}>Rejected Application</Text>
        <Text style={styles.nam}>Application Count: {facultyMembers.length}</Text>
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
  frombox: {
    backgroundColor: '#fff',
    padding: 10,
    height: 80, // Adjust the height as needed
    width: '100%', // Adjust the width as needed
    borderBottomWidth: 1,
    marginBottom: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center', // Align center horizontally
    justifyContent: 'center', // Align center vertically
    alignSelf: 'center', // Center the container itself
  },
  fromBoxText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  facultyMemberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    padding: 10,
    marginTop: 30,
  },
  facultyMemberInfo: {
    flexDirection: 'column',
  },
  facultyMemberName: {
    fontSize: 18,
    color: 'black',
    marginBottom: 5,
  },
  aridNoText: {
    fontSize: 16,
    color: 'gray',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
});

export default RejectedApplication;
