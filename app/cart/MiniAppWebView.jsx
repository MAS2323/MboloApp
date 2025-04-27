import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const MiniAppWebView = () => {
  const [error, setError] = useState(null);
  const webViewRef = useRef(null);
  const { webViewData: webViewDataRaw } = useLocalSearchParams();
  // States to track WebView navigation
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  console.log("Route params in MiniAppWebView:", useLocalSearchParams());
  console.log("Received webViewDataRaw in MiniAppWebView:", webViewDataRaw);

  // Parse webViewData if it's a JSON string
  let webViewData;
  try {
    webViewData =
      typeof webViewDataRaw === "string" && webViewDataRaw.trim() !== ""
        ? JSON.parse(webViewDataRaw)
        : webViewDataRaw;
  } catch (e) {
    console.error("Failed to parse webViewData as JSON:", e.message);
    webViewData = webViewDataRaw;
  }

  // Extract URL from webViewData if it's an object
  const url =
    typeof webViewData === "object" && webViewData?.url
      ? webViewData.url
      : webViewData;
  console.log("Processed URL for WebView:", url);

  // Handle empty or invalid URL
  if (!url || typeof url !== "string" || url.trim() === "") {
    console.warn("No valid URL provided, rendering error screen");
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mini App</Text>
          <TouchableOpacity onPress={() => webViewRef.current?.reload()}>
            <MaterialIcons name="refresh" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            No valid content provided for this miniApp. Please contact support
            or try again.
          </Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => webViewRef.current?.goBack()}
            disabled={true} // Disabled in error state
          >
            <MaterialIcons name="arrow-back-ios" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => webViewRef.current?.goForward()}
            disabled={true} // Disabled in error state
          >
            <MaterialIcons name="arrow-forward-ios" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Validate URL format
  if (!url.startsWith("http")) {
    console.error("Invalid URL, rendering error screen:", url);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mini App</Text>
          <TouchableOpacity onPress={() => webViewRef.current?.reload()}>
            <MaterialIcons name="refresh" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Invalid URL format: Must be a valid HTTP/HTTPS URL.
          </Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => webViewRef.current?.goBack()}
            disabled={true} // Disabled in error state
          >
            <MaterialIcons name="arrow-back-ios" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => webViewRef.current?.goForward()}
            disabled={true} // Disabled in error state
          >
            <MaterialIcons name="arrow-forward-ios" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mini App</Text>
        <TouchableOpacity onPress={() => webViewRef.current?.reload()}>
          <MaterialIcons name="refresh" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load content: {error}</Text>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowUniversalAccessFromFileURLs={true}
          allowsBackForwardNavigationGestures={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4c86A8" />
            </View>
          )}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("WebView error:", nativeEvent);
            setError(nativeEvent.description || "Unknown error");
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("WebView HTTP error:", nativeEvent);
            setError(`HTTP Error ${nativeEvent.statusCode}`);
          }}
          onMessage={(event) => {
            console.log("Message from WebView:", event.nativeEvent.data);
          }}
          onNavigationStateChange={(navState) => {
            console.log("WebView navigation state:", navState);
            setCanGoBack(navState.canGoBack);
            setCanGoForward(navState.canGoForward);
          }}
        />
      )}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => webViewRef.current?.goBack()}
          disabled={!canGoBack}
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={24}
            color={canGoBack ? "#000" : "#ccc"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => webViewRef.current?.goForward()}
          disabled={!canGoForward}
        >
          <MaterialIcons
            name="arrow-forward-ios"
            size={24}
            color={canGoForward ? "#000" : "#ccc"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  webView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 18,
    color: "#ff0000",
    textAlign: "center",
    fontWeight: "bold",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
});

export default MiniAppWebView;
