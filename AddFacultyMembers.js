import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const AddFacultyMembers = () => {
    const [name, setName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [avatar, setAvatar] = useState(null);

    const handleAdd = () => {
        // Add faculty member logic goes here
        console.log('Add Faculty Member');
    };

    const handleCancel = () => {
        // Cancel logic goes here
        console.log('Cancel');
    };

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            console.log('Image picker response:', response);
            if (!response.didCancel) {
                const selectedImageUri = response.assets[0].uri; // Extract URI from assets array
                console.log('Selected image URI:', selectedImageUri);
                setAvatar(selectedImageUri);
            } else {
                console.log('Image selection cancelled.');
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.name}>Add Faculty Member</Text>
            <View style={styles.horizontalLine} />
            
            <TouchableOpacity style={styles.selectImageButton} onPress={selectImage}>
                <Image source={require('./cameras.png')} style={styles.cameraIcon} />
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
                onChangeText={text => setContactInfo(text)}
                value={contactInfo}
            />

            {avatar && <Image source={{ uri: avatar }} style={styles.selectedImage} />}

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
        color: 'white', // Set text color to white
        borderRadius: 10,
        width: '80%',
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
        marginLeft: 20
    },
    button: {
        width: '80%',
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10
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
    cameraIcon: {
        width: 100,  // Adjust width
        height: 100, // Adjust height
        borderRadius: 35,
    },
    selectedImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 20,
        marginBottom: 10,
    },
});

export default AddFacultyMembers;
