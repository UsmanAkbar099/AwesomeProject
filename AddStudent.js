import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { RadioButton } from 'react-native-paper';
import { BASE_URL } from './config';

const AddStudentForm = () => {
    const [pic, setPic] = useState(null);
    const [name, setName] = useState('');
    const [semester, setSemester] = useState('');
    const [section, setSection] = useState('');
    const [cgpa, setCgpa] = useState('');
    const [gender, setGender] = useState('');
    const [degree, setDegree] = useState('');
    const [aridNo, setAridNo] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [password, setPassword] = useState('');

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (response.assets && response.assets.length > 0) {
                setPic(response.assets[0].uri);
            }
        });
    };

    const genderOptions = [
        { id: '1', label: 'Male', value: 'M' },
        { id: '2', label: 'Female', value: 'F' },
    ];

    const submitForm = async () => {
        if (!name || !semester || !section || !cgpa || !gender || !degree || !aridNo || !fatherName || !password) {
            Alert.alert('Validation Error', 'Please fill out all fields');
            return;
        }
        // const aridRegex = /^\d{4}-Arid-\d{4}$/;
        // if (!aridRegex.test(aridNo)) {
        //     Alert.alert('Validation Error', 'Please enter a valid ARID number in the format "yyyy-Arid-xxxx"');
        //     return;
        // }

        const formData = new FormData();
        console.log(pic)
        if (pic) {
            formData.append('pic', {
                uri: pic,
                type: 'image/jpeg', // Assuming jpeg format; adjust if necessary
                name: 'profile.jpg', // Adjust if you have the actual file name
            });
        }
        formData.append('name', name);
        formData.append('semester', semester);
        formData.append('section', section);
        formData.append('cgpa', cgpa);
        formData.append('gender', gender);
        formData.append('degree', degree);
        formData.append('aridno', aridNo);
        formData.append('fathername', fatherName);
        formData.append('password', password);
        console.log(JSON.stringify(formData));

        try {
            const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/AddStudent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,

            });

            
            try {
               // const data = JSON.parse(responseText); // Try to parse it as JSON

                Alert.alert('Success', 'Student added successfully');
                // Reset form fields
                setPic(null);
                setName('');
                setSemester('');
                setSection('');
                setCgpa('');
                setGender('');
                setDegree('');
                setAridNo('');
                setFatherName('');
                setPassword('');

            } catch (jsonError) {
                console.error('JSON Parse Error:', jsonError);
                Alert.alert('Error', 'Failed to parse server response');
            }

        } catch (error) {
            console.error('Fetch Error:', error);
            Alert.alert('Error', 'Network request failed. Please check your network connection and server.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={selectImage}>
                <View style={styles.imageContainer}>
                    {pic ? (
                        <Image source={{ uri: pic }} style={styles.image} />
                    ) : (
                        <Text style={styles.selectImageText}>Select Profile Image</Text>
                    )}
                </View>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="black"
            />

            <TextInput
                style={styles.input}
                placeholder="Semester"
                value={semester}
                onChangeText={setSemester}
                placeholderTextColor="black"
            />

            <TextInput
                style={styles.input}
                placeholder="Section"
                value={section}
                onChangeText={setSection}
                placeholderTextColor="black"
            />

            <TextInput
                style={styles.input}
                placeholder="CGPA"
                value={cgpa}
                onChangeText={setCgpa}
                keyboardType="numeric"
                placeholderTextColor="black"
            />

            <RadioButton.Group
                onValueChange={newValue => setGender(newValue)}
                value={gender}
            >
                <View style={styles.radioButtonContainer}>
                    {genderOptions.map(option => (
                        <View key={option.id} style={styles.radioButton}>
                            <Text>{option.label}</Text>
                            <RadioButton value={option.value} />
                        </View>
                    ))}
                </View>
            </RadioButton.Group>

            <RNPickerSelect
                onValueChange={value => setDegree(value)}
                items={[
                    { label: 'BSc', value: 'bsc' },
                    { label: 'MSc', value: 'msc' },
                    { label: 'PhD', value: 'phd' },
                ]}
                placeholder={{ label: "Select Degree", value: null }}
                style={pickerSelectStyles}
            />

            <TextInput
                style={styles.input}
                placeholder="eg=2020-ARID-3999"
                value={aridNo}
                onChangeText={setAridNo}
                placeholderTextColor="black"
            />

            <TextInput
                style={styles.input}
                placeholder="Father's Name"
                value={fatherName}
                onChangeText={setFatherName}
                placeholderTextColor="black"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                placeholderTextColor="black"
            />

            <Button title="Submit" onPress={submitForm} color="green" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#82b7bf',
        padding: 20,
        alignItems: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        width: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 5,
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 50,
    },
    selectImageText: {
        color: 'black',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        width: '100%',
        color: 'black',
        borderRadius: 5,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom: 0,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom: 0,
    },
});

export default AddStudentForm;

