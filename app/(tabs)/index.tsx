import { Button, ButtonText } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Home = () => {
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Button onPress={() => signOut()}>
        <ButtonText>Click</ButtonText>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Home;
