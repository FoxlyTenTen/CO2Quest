import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";

export default function CarbonCalc() {
  const [fuelAmount, setFuelAmount] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [carbonEmission, setCarbonEmission] = useState<number | null>(null);

  const emissionFactors: { [key: string]: number } = {
    Petrol: 2.32,
    Diesel: 2.68,
    LPG: 1.51,
  };

  const handleCalculate = () => {
    if (!fuelAmount || !fuelType) {
      alert('Please enter fuel amount and select fuel type.');
      return;
    }

    const fuelLiters = parseFloat(fuelAmount);

    if (!emissionFactors[fuelType]) {
      alert('Invalid fuel type selected.');
      return;
    }

    const emission = fuelLiters * emissionFactors[fuelType];
    setCarbonEmission(emission);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carbon Emission Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Fuel Amount (liters)"
        keyboardType="numeric"
        value={fuelAmount}
        onChangeText={setFuelAmount}
      />

      <Text style={styles.label}>Select Fuel Type:</Text>
      <View style={styles.typeContainer}>
        {['Petrol', 'Diesel', 'LPG'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              fuelType === type && styles.selectedTypeButton,
            ]}
            onPress={() => setFuelType(type)}
          >
            <Text style={[
              styles.typeButtonText,
              fuelType === type && { color: 'white' },
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Calculate Emission" onPress={handleCalculate} />

      {carbonEmission !== null && (
        <Text style={styles.resultText}>
          Estimated Carbon Emission: {carbonEmission.toFixed(2)} kg CO₂
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  selectedTypeButton: {
    backgroundColor: '#ff6600',
    borderColor: '#ff6600',
  },
  typeButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
