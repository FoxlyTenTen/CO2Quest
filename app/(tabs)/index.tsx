import { View, Text, ScrollView, StyleSheet } from 'react-native' // 🛠️ Import ScrollView from react-native
import React from 'react'
import Header from "@/components/header"
import { SafeAreaView } from 'react-native-safe-area-context'
import VehicleCarb from "@/components/vehicleCarbon"
import RewardDash from "@/components/reward"
import Pointdash from "@/components/pointsDashboard"

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Header />
        <Pointdash />
        <VehicleCarb />
        <RewardDash />
      </ScrollView>
    </SafeAreaView>
  )
}
