import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const ADDPoliciess = () => {
    const [cgpa, setCGPA] = useState('');
    const [PolicyDecription, setPolicyDecription] = useState('');
    const [DeadLine, setDeadLine] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);

    const handleAdd = () => {
        // Add faculty member logic goes here
        console.log('Add ADDPolicies');
        console.log('Selected option:', selectedOption);
    };

    const handleCancel = () => {
        // Cancel logic goes here
        console.log('Cancel');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.name}>ADD Policies</Text>
            <View style={styles.horizontalLine} />
            <Text style={styles.inputs}>Select Option</Text>
            <RNPickerSelect
                style={{
                    inputIOS: styles.input,
                    inputAndroid: styles.input,
                    viewContainer: styles.pickerContainer,
                    placeholder: styles.placeholder,
                }}
                onValueChange={(value) => setSelectedOption(value)}
                items={[
                    { label: 'Merit Base', value: 'merit' },
                    { label: 'Need Base', value: 'need' },
                ]}
                value={selectedOption}
                placeholder={{
                    label: 'Select Policies For.....',
                    value: null,
                }}
                placeholderTextColor="black"
            />
            <Text style={styles.inputs}>Minimum CGPA</Text>
            <TextInput
                style={styles.input}
                placeholder="CGPA"
                placeholderTextColor="#333333"
                onChangeText={text => setCGPA(text)}
                value={cgpa}
            />
            <Text style={styles.inputs}>Policy Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Policy Description"
                placeholderTextColor="#333333"
                onChangeText={text => setPolicyDecription(text)}
                value={PolicyDecription}
            />
            <Text style={styles.inputs}>Dead Line</Text>
            <TextInput
                style={styles.input}
                placeholder="Dead Line"
                placeholderTextColor="#333333"
                onChangeText={text => setDeadLine(text)}
                value={DeadLine}
            />

            <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={handleAdd}>
                <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
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
        fontWeight: 'bold',
        textTransform: 'uppercase',
        paddingVertical: 1,
        color: 'red',
        fontSize: 24,
        marginTop: 19,
    },
    horizontalLine: {
        backgroundColor: 'black',
        height: 2,
        width: '100%',
        marginTop: 10,
    },
    input: {
        backgroundColor: '#ffffff',
        color: 'black', // Set text color to black
        borderRadius: 10,
        width: '80%',
        height: 50,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    inputs: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        paddingVertical: 1,
        color: 'black',
        fontSize: 18,
        marginTop: 0,
        paddingHorizontal: 10,
        marginBottom: 10,
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: 20,
    },
    button: {
        width: '80%',
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    pickerContainer: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
   
        
    
});

export default ADDPoliciess;
