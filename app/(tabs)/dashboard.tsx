import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import DashBoard from "@/components/dashboardCarb"
import ChartLive from "@/components/chartLive"
export default function dashboard() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "white"}}>
      <DashBoard/>
      <ChartLive/>
    </SafeAreaView>
  )
}