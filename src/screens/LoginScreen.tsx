import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Portal, Dialog, Paragraph, Button as PaperButton } from "react-native-paper";
import Input from "../components/Input";
import Button from "../components/Button";
import { login } from "../services/api";
import { setAuthToken } from "../utils/auth";
import { AuthResponse, ApiError } from "../types";

type RootStackParamList = {
	MainTabs: undefined;
	Register: undefined;
};

const LoginScreen = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [dialogMessage, setDialogMessage] = useState("");

	const handleLogin = async () => {
		if (!username || !password) {
			setDialogMessage("Please fill in all fields");
			setVisible(true);
			return;
		}

		setLoading(true);
		try {
			const response = (await login(username, password)) as AuthResponse;
			await setAuthToken(response.data.token);
			navigation.reset({
				index: 0,
				routes: [{ name: "MainTabs" }],
			});
		} catch (error : any) {
			const apiError = error as ApiError;
			const errorMessage = apiError.data?.message || "Something went wrong";
			const errors = apiError.data?.errors;
			console.log("Error details:", errors);
			const passwordError = errors?.password;
			const usernameError = errors?.username;
			setDialogMessage(
				passwordError ? `${errorMessage}: ${passwordError}` :
					usernameError ? `${errorMessage}: ${usernameError}` :
					errorMessage
			);
			setVisible(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Image source={require("../../assets/switter.png")} style={styles.logo} />
			<Text style={styles.title}>Login</Text>
			<Input
				placeholder="Username"
				value={username}
				onChangeText={setUsername}
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
				title={loading ? "Logging in..." : "Login"}
				onPress={handleLogin}
				disabled={loading}
				style={styles.loginButton}
				titleStyle={styles.loginButtonText}
			/>
			<TouchableOpacity
				style={styles.registerLink}
				onPress={() => navigation.navigate("Register")}
			>
				<Text style={styles.registerText}>Don't have an account? Register</Text>
			</TouchableOpacity>
			<Portal>
				<Dialog visible={visible} onDismiss={() => setVisible(false)}>
					<Dialog.Title>Error</Dialog.Title>
					<Dialog.Content>
						<Paragraph>{dialogMessage}</Paragraph>
					</Dialog.Content>
					<Dialog.Actions>
						<PaperButton onPress={() => setVisible(false)}>OK</PaperButton>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 16,
		backgroundColor: "#121212",
	},
	logo: {
		width: 150,
		height: 150,
		alignSelf: "center",
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
		color: "#fff",
	},
	input: {
		backgroundColor: "#1E1E1E",
		color: "#fff",
	},
	loginButton: {
		backgroundColor: "#fff",
		borderRadius: 4,
		paddingVertical: 10,
	},
	loginButtonText: {
		color: "#000",
		fontWeight: "bold",
	},
	registerLink: {
		marginTop: 15,
		alignItems: "center",
	},
	registerText: {
		color: "#FFFFFF",
	},
});

export default LoginScreen;
