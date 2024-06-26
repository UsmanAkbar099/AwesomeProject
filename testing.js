import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const FilePickerScreen = () => {
  const [fileName, setFileName] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setFileName(result[0].name);
      setFileDetails(result[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Unknown error: ', err);
      }
    }
  };

  const uploadFile = async () => {
    if (fileDetails) {
      const formData = new FormData();
      formData.append('enrollment', {
        uri: fileDetails.uri,
        type: fileDetails.type,
        name: fileDetails.name,
      });

      try {
        const response = await fetch('http://192.168.82.26/FinancialAidAllocation/api/Admin/UploadFile', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const result = await response.json();
        console.log('Upload successful:', result);
        Alert.alert('Upload Successful', JSON.stringify(result, null, 2));
      } catch (error) {
        console.error('Error uploading file:', error);
        Alert.alert('Upload Failed', 'There was an error uploading the file.');
      }
    } else {
      console.log('No file selected');
      Alert.alert('No File Selected', 'Please select a file to upload.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Excel File Picker</Text>
      <TouchableOpacity onPress={pickFile} style={styles.buttons}>
        <Text style={styles.buttonTexts}>Pick a File</Text>
      </TouchableOpacity>
      {fileName && <Text style={styles.fileName}>Selected File: {fileName}</Text>}
      <TouchableOpacity onPress={uploadFile} style={styles.button}>
        <Text style={styles.buttonText}>Upload File</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#82b7bf',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttons: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    height: '8%',
    width: '50%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonTexts: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 50,
  },
  fileName: {
    marginTop: 20,
    fontSize: 20,
    color: 'red',
  },
});

export default FilePickerScreen;
