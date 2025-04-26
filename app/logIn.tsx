import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth"; //must be included
import { auth } from "@/firebaseConfig";//must be included
import { useRouter } from "expo-router";//must be included

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const loginHandler = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in!");
      router.replace("/(tabs)");  // Navigate to Home
    } catch (error) {
      Alert.alert("Error");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "white"}}>
      <Text>Sign In</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, width: "80%", padding: 10, marginVertical: 10 }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, width: "80%", padding: 10, marginVertical: 10 }}
        secureTextEntry
      />
      <Button title="Login" onPress={loginHandler} />
      <Button title="Go to Register" onPress={() => router.push("../signUp")} />
    </View>
  );
}
