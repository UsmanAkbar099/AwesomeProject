import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { BASE_URL } from './config';

const AddCommitteeMember = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFacultyMembers();
  }, []);

  const fetchFacultyMembers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/FacultyMembers`);
      if (!response.ok) {
        throw new Error('Failed to fetch faculty members');
      }
      const data = await response.json();
      console.log('Fetched Faculty Members:', data); // Add this line to log fetched data
      setFacultyMembers(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
      setIsLoading(false);
    }
  };

  const handleAddButtonPress = async (facultyId) => {
    if (!facultyId) {
      console.error('Invalid faculty ID:', facultyId);
      return;
    }

    try {
      const addResponse = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/AddCommitteeMember/${facultyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (addResponse.ok) {
        console.log('Faculty Member added with ID:', facultyId);
        Alert.alert('Success', 'Faculty member added as a committee member.');
      } else {
        const errorText = await addResponse.text();
        if (errorText.includes('Already Exist')) {
          Alert.alert('Error', 'This faculty member is already a committee member.');
        } else {
          console.error('Error adding faculty member:', errorText);
          Alert.alert('Error', 'Failed to add faculty member. ' + (errorText ? errorText : 'Please try again later.'));
        }
      }
    } catch (error) {
      console.error('Error adding faculty member:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  const renderFacultyMember = ({ item }) => {
    return (
      <View style={styles.facultyMemberContainer}>
        <Image source={item.profilePic ? { uri: `${BASE_URL}/FinancialAidAllocation/Content/ProfileImages/` + item.profilePic } : require('./logo.png')} style={styles.facultyMemberImage} />
        <View style={styles.facultyMemberInfo}>
          <Text style={styles.facultyMemberName}>{item.name}</Text>
          <TouchableOpacity onPress={() => handleAddButtonPress(item.facultyId)}>
            <View style={styles.addButton}>
              <Text style={styles.addButtonText}>ADD</Text>
            </View>
          </TouchableOpacity>
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
        <Text style={styles.name}>Add Committee Members</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.searchBarContainer}>
        <Image source={require('./Search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search Faculty Members"
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={facultyMembers.filter(member =>
          member.name && member.name.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderFacultyMember}
        keyExtractor={(item, index) => item.facultyId ? item.facultyId.toString() : index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
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
  facultyMemberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  facultyMemberInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  facultyMemberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  facultyMemberName: {
    flex: 1,
    fontSize: 20,
    color: 'black',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddCommitteeMember;
