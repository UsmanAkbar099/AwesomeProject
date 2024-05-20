import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';


const MeritBaseCriteria = () => {
    const handleBack = () => {
        // Your form submission logic goes here
        console.log('Back From');
    };
    return (
        <View style={styles.container}>
            
            <Text style={styles.name}>Merit Base Criteria</Text>
            <View style={styles.horizontalLine} />
            <Text style={styles.text}>Hello, this is a simple text page.</Text>
            <Text style={styles.text}>You can add more text here as needed.</Text>
            <Text style={styles.text}>Customize the styles to match your design.</Text>
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
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 20,
    },
    imageContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    image: {
        width: 30,
        height: 30,
    },
    name: {
        position: 'absolute',
        top: 0,
        fontWeight: "bold",
        textTransform: "uppercase",
        paddingVertical: 1,
        color: "red",
        fontSize: 24,
        marginTop:20,
    },
    horizontalLine: {
        backgroundColor: 'black',
        position: 'absolute',
        top:0,
        height: 2,
        width: '100%',
        marginTop: 50,
      },
});

export default MeritBaseCriteria;
