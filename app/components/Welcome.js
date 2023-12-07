import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weelpy</Text>
      <Text style={styles.subtitle}>Forewarned is forearmed</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Let's get started</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlinedButton}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.outlinedButtonText}>Have an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 12,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  outlinedButton: {
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    width: '45%',
    alignItems: 'center',
  },
  outlinedButtonText: {
    color: 'green',
    fontWeight: 'bold',
  },
});

export default Welcome;
