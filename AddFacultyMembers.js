import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { BASE_URL } from './config';

const AddFacultyMembers = () => {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [pic, setPic] = useState(null);

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (response.assets && response.assets.length > 0) {
                setPic(response.assets[0].uri);
            }
        });
    };

    const validatePhoneNumber = (phoneNumber) => {
        const regex = /^\d{11}$/; // Assumes a 10-digit phone number
        return regex.test(phoneNumber);
    };

    const handleAdd = async () => {
        if (!name || !contact || !password) {
            Alert.alert('Validation Error', 'Please fill out all fields');
            return;
        }

        if (!validatePhoneNumber(contact)) {
            Alert.alert('Validation Error', 'Please enter a valid contact number');
            return;
        }

        const formData = new FormData();
        if (pic) {
            formData.append('pic', {
                uri: pic,
                type: 'image/jpeg',
                name: 'profile.jpg',
            });
        }
        formData.append('name', name);
        formData.append('contact', contact);
        formData.append('password', password);

        console.log('FormData:', JSON.stringify(formData));

        try {
            const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/AddFacultyMember`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (response.ok) {
                Alert.alert('Success', 'Faculty member added successfully');
                // Reset form fields
                setName('');
                setContact('');
                setPassword('');
                setPic(null);
            } else {
                const errorText = await response.text();
                console.error('Failed to add faculty member:', errorText);
                Alert.alert('Error', errorText || 'Failed to add faculty member. Please try again later.');
            }
        } catch (error) {
            console.error('Error adding faculty member:', error);
            Alert.alert('Error', 'Network request failed. Please check your network connection and server.');
        }
    };

    const handleCancel = () => {
        // Clear all input fields
        setName('');
        setContact('');
        setPassword('');
        setPic(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.name}>Add Faculty Member</Text>
            <View style={styles.horizontalLine} />

            <TouchableOpacity style={styles.selectImageButton} onPress={selectImage}>
                <View style={styles.imageContainer}>
                    {pic ? (
                        <Image source={{ uri: pic }} style={styles.selectedImage} />
                    ) : (
                        <Text style={styles.selectImageText}>Select Profile Image</Text>
                    )}
                </View>
            </TouchableOpacity>

            <Text style={styles.inputs}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#333333"
                onChangeText={text => setName(text)}
                value={name}
            />
            <Text style={styles.inputs}>Contact Info</Text>
            <TextInput
                style={styles.input}
                placeholder="Contact Info"
                placeholderTextColor="#333333"
                onChangeText={text => setContact(text)}
                value={contact}
            />
            <Text style={styles.inputs}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#333333"
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry
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
        padding: 20,
    },
    name: {
        fontWeight: "bold",
        textTransform: "uppercase",
        paddingVertical: 1,
        color: "red",
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
        color: 'black',
        borderRadius: 10,
        width: '100%',
        height: 50,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    inputs: {
        fontWeight: "bold",
        textTransform: "uppercase",
        paddingVertical: 1,
        color: "black",
        fontSize: 18,
        marginTop: 0,
        paddingHorizontal: 10,
        marginBottom: 10,
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: 20,
    },
    button: {
        width: '100%',
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
    selectImageButton: {
        marginTop: 20,
        marginBottom: 10,
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
    selectedImage: {
        height: 100,
        width: 100,
        borderRadius: 50,
    },
    selectImageText: {
        color: 'black',
    },
});

export default AddFacultyMembers;
