import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
const NoEventsMessage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles2.text}>No events available at the moment</Text>
      <Text style={styles2.subtext}>Please check back later</Text>
    </View>
  );
};

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
  },
});
const EventScreen = () => {
  const events: any = [];

  return (
    <View style={styles.container}>
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(event) => event.id}
          renderItem={({ item }) => (
            <View style={styles.eventContainer}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDate}>{item.date}</Text>
            </View>
          )}
        />
      ) : (
        <NoEventsMessage />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  eventContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 16,
    color: "#666",
  },
  noEventsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noEventsText: {
    fontSize: 18,
    color: "#666",
  },
});

export default EventScreen;
