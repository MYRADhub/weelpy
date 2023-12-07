import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import theme from './app/styles/theme';
import Home from './app/screens/Home';
import SignIn from './app/screens/SignIn';
import SignUp from './app/screens/SignUp';
import Content from './app/screens/Content';
import SuccessPage from './app/screens/SuccessPage';
import 'expo-dev-client'
import registerNNPushToken from 'native-notify';

const Stack = createNativeStackNavigator();

export default function App() {
  registerNNPushToken(13409, 'vmbMP9X9bMOUgX6rMF65eh');
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <MuiThemeProvider theme={theme}>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
              <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Sign In' }} />
              <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Sign Up' }} />
              <Stack.Screen
                name="SuccessPage"
                component={SuccessPage}
                options={{ title: 'Success Page', headerShown: false }}
              />
              <Stack.Screen name="Content" component={Content} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </MuiThemeProvider>
    </ApplicationProvider>
  );
}
