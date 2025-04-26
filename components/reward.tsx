import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Reward() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redeem Your SME Rewards 🎁</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        <View style={styles.rewardCard}>
          <Text style={styles.rewardTitle}>10% Discount - Starbucks SME Plan</Text>
          <Text style={styles.rewardDescription}>Enjoy 10% off for your business meetings at Starbucks outlets.</Text>
        </View>

        <View style={styles.rewardCard}>
          <Text style={styles.rewardTitle}>50% Promo - Grab for Business</Text>
          <Text style={styles.rewardDescription}>Get 50% off your first 10 delivery rides when using Grab for Business.</Text>
        </View>

        <View style={styles.rewardCard}>
          <Text style={styles.rewardTitle}>RM500 Credit - Google Ads SME</Text>
          <Text style={styles.rewardDescription}>Kickstart your online marketing with free Google Ads credit for SMEs.</Text>
        </View>

        <View style={styles.rewardCard}>
          <Text style={styles.rewardTitle}>Free Training - Digital Marketing</Text>
          <Text style={styles.rewardDescription}>Enroll in a free course to boost your small enterprise's digital presence.</Text>
        </View>

        <View style={styles.rewardCard}>
          <Text style={styles.rewardTitle}>Office Supplies Voucher</Text>
          <Text style={styles.rewardDescription}>Claim RM100 worth of office supplies from our SME partners.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    marginTop: 0,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
  },
  scrollContainer: {
    paddingLeft: 20,
  },
  rewardCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: 250,
    height: 140,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#555',
  },
});
