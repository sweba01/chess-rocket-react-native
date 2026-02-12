import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, Text, View } from "react-native";

const LifecycleExample = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 🟢 MOUNT (runs first time)
    console.log("Component Mounted");

    return () => {
      // 🔴 UNMOUNT (runs when component removed)
      console.log("Component Unmounted");
    };
  }, []);

  useEffect(() => {
    // 🟡 UPDATE (runs whenever count changes)
    if (count !== 0) {
      console.log("Count Updated:", count);
    }
  }, [count]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flex: 1,
          marginTop: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 24 }}>{count}</Text>
        <Button title="Increase" onPress={() => setCount(count + 1)} />
      </View>
    </SafeAreaView>
  );
};

export default LifecycleExample;
