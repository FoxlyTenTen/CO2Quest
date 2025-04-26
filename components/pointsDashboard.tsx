import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PointsDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Eco Points</Text>
      <Text style={styles.points}>1500 pts 🌱</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  points: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
