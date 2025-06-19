import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    // Configure Google Sign-in
    GoogleSignin.configure({
      webClientId: "815076615824-mvlg6of1mnaeo8b7ino19a3s85hv7l58.apps.googleusercontent.com" ,   
      offlineAccess: true,
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      // Check if device supports Google Play
      await GoogleSignin.hasPlayServices({ 
        showPlayServicesUpdateDialog: true 
      });
      
      // Get user info from Google
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-in successful:', userInfo);
      
      // Set user data (without Firebase for now)
      setUser(userInfo.data);
      
      Alert.alert('Success!', `Welcome ${userInfo.data.user.name}!`);
      
    } catch (error) {
      console.error('Sign-in error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Google sign-in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Google sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play services not available');
      } else {
        Alert.alert('Error', `Sign-in failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Sign out from Google
      await GoogleSignin.signOut();
      
      // Clear user data
      setUser(null);
      
      Alert.alert('Success!', 'You have been signed out');
      
    } catch (error) {
      console.error('Sign-out error:', error);
      Alert.alert('Error', `Sign-out failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {user ? (
          // User is signed in - show user info
          <View style={styles.userContainer}>
            <Text style={styles.title}>Welcome! 👋</Text>
            
            <View style={styles.userCard}>
              <Text style={styles.userLabel}>Name:</Text>
              <Text style={styles.userValue}>{user.user.name}</Text>
              
              <Text style={styles.userLabel}>Email:</Text>
              <Text style={styles.userValue}>{user.user.email}</Text>
              
              <Text style={styles.userLabel}>ID:</Text>
              <Text style={styles.userValue}>{user.user.id.substring(0, 10)}...</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.button, styles.signOutButton]} 
              onPress={signOut}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Signing Out...' : 'Sign Out'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // User is not signed in - show sign in screen
          <View style={styles.signInContainer}>
            <Text style={styles.title}>Google Sign-in Test</Text>
            <Text style={styles.subtitle}>Test Google authentication without Firebase</Text>
            
            <TouchableOpacity 
              style={[styles.button, styles.googleButton]} 
              onPress={signInWithGoogle}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? '🔄 Signing In...' : '🔍 Sign in with Google'}
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.note}>
              This will test Google Sign-in only{'\n'}
              (Firebase integration comes next)
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  signInContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  userContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  note: {
    fontSize: 14,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  userCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  userValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  signOutButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;