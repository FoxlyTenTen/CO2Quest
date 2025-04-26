import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CarbonTracker() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carbon Tracker 📈</Text>
      <Text style={styles.data}>Today: 2.5 kg CO₂</Text>
      <Text style={styles.data}>Weekly: 17.8 kg CO₂</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  data: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
});
