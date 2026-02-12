import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

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
    <View style={{ marginTop: 50, alignItems: "center" }}>
      <Text style={{ fontSize: 24 }}>{count}</Text>

      <Button title="Increase" onPress={() => setCount(count + 1)} />
    </View>
  );
};

export default LifecycleExample;
