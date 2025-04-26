import { View, Text, StyleSheet, Button, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebaseConfig";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  return (
    <View style={styles.headerBox}>
      <View>
        <Text style={styles.welcome}>Welcome back,</Text>
        {user ? (
          <Text style={styles.username}>{user.displayName || "User"}</Text>
        ) : (
          <Text style={styles.username}>Users</Text>
        )}
      </View>
      <View>
        {!user ? (
          <>
            <TouchableOpacity style={styles.registerForm}>
              <Button title="Sign In" onPress={() => router.replace("/logIn")} />
            </TouchableOpacity>
           
          </>
        ) : (
          <TouchableOpacity style={styles.registerForm}>
            <Button title="Logout" onPress={() => auth.signOut()} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: "20%",
    paddingTop: 20,
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 20, // ✅ Higher elevation for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#325A3E",
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: "#325A3E",
  },
  registerForm: {
    borderRadius: 10,
    fontSize: 10,
  },
});
