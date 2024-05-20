import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';

const GraderInfo = () => {
    const handleBack = () => {
        // Your form submission logic goes here
        console.log('Back From');
    };

    // Sample data for the FlatList
    const [graderData, setGraderData] = useState([
        { name: 'Shahid Abid', image: require('./logo.png') },
        { name: 'MUHAMMAD Waseem', image: require('./logo.png') },
       
        // Add more grader data objects here
    ]);

    const renderGraderItem = ({ item, index }) => (
        <View style={styles.graderItem}>
            <Image source={item.image} style={styles.graderItemImage} />
            <Text style={styles.graderItemName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteGrader(index)}>
                <Image source={require('./Delete.png')} style={styles.deleteIcon} />
            </TouchableOpacity>
        </View>
    );

    const handleDeleteGrader = (index) => {
        // Create a copy of the graderData array
        const newData = [...graderData];
        // Remove the item at the specified index
        newData.splice(index, 1);
        // Update the graderData state with the new array
        setGraderData(newData);
        
        // Show a message in the console
        console.log(`Deleted grader: ${graderData[index].name}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.name}>Grader Info</Text>
            <View style={styles.horizontalLine} />
            <View style={styles.frombox}>
                <Text style={styles.wel}>MUHAMMAD ALI</Text>
                <Text style={styles.nam}>2020-Arid-4333</Text>
                <Text style={styles.ard}>Bscs 8D</Text>
            </View>
            <Text style={styles.wels}>Grader Of</Text>
            
            <ScrollView>
                <FlatList
                    data={graderData}
                    renderItem={renderGraderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </ScrollView>
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
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'red',
        marginTop: 20,
    },
    horizontalLine: {
        backgroundColor: 'black',
        height: 2,
        width: '100%',
        marginTop: 10,
    },
    frombox: {
        backgroundColor: '#fff',
        padding: 20,
        height: 150,
        width: '90%',
        borderTopWidth: 1,
        borderRadius: 30,
        marginBottom: 20,
    },
    wel: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
        marginLeft: 20,
    },
    wels: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginRight: 200,
        marginBottom: 20,
    },
    nam: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'gray',
        textAlign: 'center',
    },
    ard: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'gray',
        textAlign: 'center',
    },
    graderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
        width: 320,
        height: 100,
        borderRadius: 10,
    },
    graderItemImage: {
        width: 60,
        height: 60,
        borderRadius: 15, // To make it round
        marginLeft: 10,
    },
    graderItemName: {
        flex: 1,
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    deleteIcon: {
        width: 50,
        height: 50,
        borderRadius: 30,
    },
});

export default GraderInfo;
