import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { BASE_URL } from './config';

const NeedBaseCriteria = () => {
    const [filteredPolicyList, setFilteredPolicyList] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/getPolicies`);
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched data:', data); // Log fetched data to console
                // Filter data where policyFor is "MeritBase"
                const filteredData = data.filter(item => item.p.policyfor=='NeedBase');
                setFilteredPolicyList(filteredData); // Update the state with filtered data
            } else {
                console.error('Failed to fetch data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.policyFor}>{item.p.policyfor}</Text>
                <Text style={styles.description}>{item.c.description}</Text>
                <Text style={styles.session}>{item.p.session}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.name}>Need Base Criteria</Text>
            <View style={styles.horizontalLine} />

            {/* FlatList component */}
            <View style={styles.flat}>
                <FlatList
                    data={filteredPolicyList}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.policyListContainer}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#82b7bf',
    },
    flat: {
        flex: 1,
        marginTop: 70,
    },
    imageContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    session: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'green',
    },
    image: {
        width: 30,
        height: 30,
    },
    itemContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    policyFor: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
    },
    description: {
        fontSize: 16,
        color: 'black',
    },
    name: {
        position: 'absolute',
        top: 0,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        paddingVertical: 1,
        color: 'red',
        fontSize: 24,
        marginTop: 20,
    },
    horizontalLine: {
        backgroundColor: 'black',
        position: 'absolute',
        top: 0,
        height: 2,
        width: '100%',
        marginTop: 50,
    },
});

export default NeedBaseCriteria;