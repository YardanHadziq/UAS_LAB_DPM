import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Portal, Dialog, Paragraph, Button as PaperButton } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Input from '../components/Input';
import Button from '../components/Button';
import { register } from '../services/api';
import {RootStackParamList} from "../types";

const RegisterScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const handleRegister = async () => {
        setLoading(true);
        try {
            await register(username, password, email);
            setDialogMessage('Registration successful!');
            setVisible(true);
        } catch (error : any) {
            console.error('Failed to register:', error.message);
            setDialogMessage('Registration failed. Please try again.');
            setVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDialogDismiss = () => {
        setVisible(false);
        if (dialogMessage.includes('successful')) {
            navigation.navigate("Login");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <Input
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button
                title="Register"
                onPress={handleRegister}
                disabled={loading}
                style={styles.registerButton}
                titleStyle={styles.registerButtonText}
            />
            <Portal>
                <Dialog visible={visible} onDismiss={handleDialogDismiss}>
                    <Dialog.Title>{dialogMessage.includes('successful') ? 'Success' : 'Error'}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{dialogMessage}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <PaperButton onPress={handleDialogDismiss}>OK</PaperButton>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
    },
    input: {
        backgroundColor: '#1E1E1E',
        color: '#fff',
    },
    registerButton: {
        backgroundColor: '#fff',
        borderRadius: 4,
        paddingVertical: 10,
        marginTop: 16,
    },
    registerButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
