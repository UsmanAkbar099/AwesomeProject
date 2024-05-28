import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Alert, RefreshControl, ScrollView } from 'react-native';
import { BASE_URL } from './config';

const CommitteeMember = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [filteredCommitteeMembers, setFilteredCommitteeMembers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/CommitteeMembers`);
      const data = await response.json();
      console.log('Fetched data:', data);
      setCommitteeMembers(data);
      setFilteredCommitteeMembers(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filterCommitteeMembers = () => {
      const filtered = committeeMembers.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCommitteeMembers(filtered);
    };

    filterCommitteeMembers();
  }, [searchQuery, committeeMembers]);

  const handleRemoveButtonPress = async (committeeId) => {
    console.log('Removing committee member with ID:', committeeId);
    try {
      const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/RemoveCommitteeMember?id=${committeeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedCommitteeMembers = committeeMembers.filter(member => member.committeeId !== committeeId);
        setCommitteeMembers(updatedCommitteeMembers);
        setFilteredCommitteeMembers(updatedCommitteeMembers);
        console.log('Committee member removed successfully');
      } else {
        console.error('Error removing committee member:', await response.text());
      }
    } catch (error) {
      console.error('Error removing committee member:', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);

  const confirmRemoveCommitteeMember = (committeeId) => {
    Alert.alert(
      "Remove Committee Member",
      "Are you sure you want to remove this committee member?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => handleRemoveButtonPress(committeeId)
        }
      ],
      { cancelable: false }
    );
  };

  const handleAddButtonPress = (committeeId) => {
    console.log('Remove button pressed for committee member with ID:', committeeId);
    confirmRemoveCommitteeMember(committeeId);
  };

  const handleAddIconPress = () => {
    props.navigation.navigate('AddCommitteeMember');
  };

  const renderCommitteeMember = ({ item }) => (
    <View style={styles.facultyMemberContainer}>
      <Image
        source={item.profilePic ? { uri: `${BASE_URL}/FinancialAidAllocation/Content/ProfileImages/${item.profilePic}` } : require('./logo.png')}
        style={styles.facultyMemberImage}
      />
      <View style={styles.facultyMemberInfo}>
        <Text style={styles.facultyMemberName}>{item.name}</Text>
      </View>
    </View>
  );

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
          placeholder="Search Committee Members"
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={filteredCommitteeMembers}
          renderItem={renderCommitteeMember}
          keyExtractor={(item, index) => (item.committeeId ? item.committeeId.toString() : index.toString())}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </SafeAreaView>
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
    flex: 1,
    justifyContent: 'space-between',
  },
  facultyMemberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  facultyMemberName: {
    fontSize: 18,
    color: 'black',
  },
  removeButton: {
    backgroundColor: 'red',
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 15,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CommitteeMember;
