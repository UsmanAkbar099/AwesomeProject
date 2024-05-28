import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { BASE_URL } from './config';

const MeritBaseShortListing = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [MeritBaseShortListing, setMeritBaseShortListing] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/GetMeritBaseShortListedStudent`);
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
    if (MeritBaseShortListing.length > 0) {
      const filtered = MeritBaseShortListing.filter((item) =>
        item.arid_no.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleNamePress = (item) => {
    Alert.alert(
      "Student Details",
      `Name: ${item.name}\nStudent ID: ${item.student_id}\nARID NO: ${item.arid_no}\nSemester: ${item.semester}\nSection: ${item.section}\nCGPA: ${item.cgpa}`,
      [{ text: "OK" }]
    );
  };

  const renderFacultyMember = ({ item }) => (
    <View style={styles.facultyMemberContainer}>
      <TouchableOpacity style={styles.nameContainer} onPress={() => handleNamePress(item)}>
        <Text style={styles.facultyMemberName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
        <Text style={styles.aridNoText}>{item.arid_no}</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image
          source={
            item.gender === 'M'
              ? require('./Male.png')
              : require('./Female.png')
          }
          style={styles.genderImage}
        />
      </View>
    </View>
  );

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
          keyExtractor={(item, index) => (item.m?.id?.toString() || item.s?.student_id?.toString() || index.toString())}
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
  nameContainer: {
    flex: 1,
    marginRight: 10,
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
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  genderImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default MeritBaseShortListing;
