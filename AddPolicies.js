import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Button, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { BASE_URL } from './config';

const Policy = (props) => {
  const [policyList, setPolicyList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredPolicyList, setFilteredPolicyList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getPolicies();
  }, []);

  useEffect(() => {
    filterPolicies();
  }, [searchText, policyList]);

  const getPolicies = async () => {
    try {
      const res = await fetchPolicies();
      if (res.status === 200) {
        const policies = await res.json();
        console.log('Fetched policies:', policies);
        setPolicyList(policies);
        setFilteredPolicyList(policies);
      } else {
        console.error('Failed to fetch policies:', res.statusText);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
    }
  };

  const fetchPolicies = async () => {
    const url = `${BASE_URL}/FinancialAidAllocation/api/Admin/getPolicies`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  };

  const filterPolicies = () => {
    if (searchText.trim() === '') {
      setFilteredPolicyList(policyList);
    } else {
      const filtered = policyList.filter(policy =>
        policy.p.policyfor && policy.p.policyfor.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPolicyList(filtered);
    }
  };

  const handleAddIconPress = () => {
    props.navigation.navigate('ADDPolicies');
  };

  const renderItem = ({ item }) => {
    let val1Label = 'Val1';
    if (item.p.policy1 === 'CGPA') {
      val1Label = 'Required CGPA';
    } else if (item.p.policy1 === 'Strength') {
      val1Label = 'Min Strength';
    }

    return (
      <View style={styles.policyContainer}>
        <Text style={styles.policyForText}>Policy For: {item.p.policyfor}</Text>
        <Text style={styles.sessionText}>Session: {item.p.session}</Text>
        <Text style={styles.descriptionText}>Description: {item.c.description}</Text>
        <Text style={styles.policyText}>Policy: {item.p.policy1}</Text>
        <Text style={styles.policyText}>{val1Label}: {item.c.val1}</Text>
        <Text style={styles.policyText}>Strength: {item.c.strength?.toString()}</Text>
      </View>
    );
  };

  const handleSearch = () => {
    filterPolicies();
  };

  const onRefresh = async () => {
    console.log('Refreshing policies...');
    setRefreshing(true);
    await getPolicies();
    setRefreshing(false);
    console.log('Policies refreshed.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>Policies</Text>
        <TouchableOpacity onPress={handleAddIconPress}>
          <Image source={require('./Add.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search by policy for"
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <FlatList
        data={filteredPolicyList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.policyListContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#82b7bf',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginTop: 10,
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
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  policyListContainer: {
    flexGrow: 1,
  },
  policyContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
  policyForText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 5,
  },
  sessionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 20,
    color: 'black',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  policyText: {
    fontSize: 16,
    color: 'black',
  },
});

export default Policy;