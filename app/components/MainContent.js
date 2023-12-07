import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';

import Posts from './Posts';
import Maps from './Maps';
import Settings from './Settings';
import NavBar from './NavBar';
import { useNavigation } from '@react-navigation/native';

const MainContent = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'posts', title: 'Posts' },
    { key: 'map', title: 'Map' },
    { key: 'settings', title: 'Settings' },
  ]);
  const [reset, setReset] = useState(false);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'posts':
        return <Posts />;
      case 'map':
        return <Maps />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      style={styles.tabBar}
      indicatorStyle={styles.indicator}
      renderLabel={({ route, focused }) => (
        <Text style={focused ? styles.tabLabelFocused : styles.tabLabel}>
          {route.title}
        </Text>
      )}
    />
  );

  const handleTabPress = (index) => {
    setIndex(index);
    setTabIndex(index);
  };

  return (
    <>
      <NavBar />
      {/* <Text style={{ fontSize: 24, textAlign: 'center', marginVertical: 20 }}>
        Content Screen
      </Text> */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleTabPress}
      />
      {/* <BottomNavigation
        selectedIndex={tabIndex}
        onSelect={handleTabPress}
        appearance="noIndicator"
      >
        <BottomNavigationTab title="Posts" />
        <BottomNavigationTab title="Map" />
        <BottomNavigationTab title="Settings" />
      </BottomNavigation> */}
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  indicator: {
    backgroundColor: 'green', // Your desired indicator color
  },
  tabLabel: {
    fontSize: 16,
    color: 'gray', // Your desired inactive tab text color
  },
  tabLabelFocused: {
    fontSize: 16,
    color: 'black', // Your desired active tab text color
  },
});

export default MainContent;
