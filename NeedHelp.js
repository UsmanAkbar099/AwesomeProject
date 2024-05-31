import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import logo from './logo.png'; // Make sure the path is correct

const HelpScreen = () => {
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.navigate('StudentDashboard');
    };

    const handleLinkPress = (url) => {
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress}>
                    
                </TouchableOpacity>
                <Text style={styles.headerText}>Help</Text>
                <Image source={logo} style={styles.logo} />
            </View>
            <View style={styles.content}>
                <View style={styles.formBox}>
                    <Text style={styles.contactDetails}>
                        <Text style={styles.bold}> BIIT: </Text>
                        106-A/1 Murree Rd, Block A Satellite Town Rawalpindi, Pakistan{"\n"}
                        <Text style={styles.bold}> Mobile Number: </Text>
                        (+92) 336-0572652{"\n"}
                        <Text style={styles.bold}> Landline Number: </Text>
                        (+92-51) 4251766, 4251767, 8731506, 8731509{"\n"}
                        <Text style={styles.bold}> Email: </Text>
                        <Text style={styles.link} onPress={() => handleLinkPress('mailto:admissions@biit.edu.pk')}>
                            admissions@biit.edu.pk
                        </Text>{"\n"}
                        <Text style={styles.bold}> Facebook: </Text>
                        <Text style={styles.link} onPress={() => handleLinkPress('https://www.facebook.com/BIITOfficial?mibextid=kFxxJD')}>
                            BIIT Official Facebook
                        </Text>{"\n"}
                        <Text style={styles.bold}> Instagram: </Text>
                        <Text style={styles.link} onPress={() => handleLinkPress('https://www.instagram.com/biitofficial?igsh=bjA5MzNrZHJ2MGly')}>
                            BIIT Official Instagram
                        </Text>
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#82b7bf',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#82b7bf',
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        color:'red'
    },
    logo: {
        height: 35,
        width: 35,
        borderRadius: 17.5,
    },
    content: {
        padding: 20,
    },
    formBox: {
        padding: 15,
        backgroundColor: '#82b7bf',
        borderRadius: 10,
    },
    contactDetails: {
        fontSize: 16,
        lineHeight: 24,
    },
    bold: {
        fontWeight: 'bold',
        color:'black'
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default HelpScreen;