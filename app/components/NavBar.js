import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, FlatList, Dimensions, ScrollView } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'

const { width, height } = Dimensions.get('window');

const dangerousSituations = [
  {
    id: '1',
    title: 'Artificial respiration',
    description: 'What to do during a heart attack',
    instructions: `
    1. Make sure that the upper respiratory tract is passable.
    2. Turn the victim's head to the side.
    3. Tilt your head back while holding your neck.
    4. Pinch the victim's nose and exhale strongly into his lungs.
    `,
  },
  {
    id: '2',
    title: 'Indirect heart massage',
    description: 'How to perform indirect heart massage',
    instructions: `
    1. If there is no pulse, lay the victim on a hard surface.
    2. Find the xiphoid process and place your palm 2-4 cm higher.
    3. Make rhythmic thrusts in the vertical direction.
    `,
  },
  {
    id: '3',
    title: 'Stopping the bleeding',
    description: 'How to stop the bleeding',
    instructions: `
    1. Do not pull out foreign objects from the wound.
    2. In case of venous bleeding, apply an aseptic bandage.
    3. In case of capillary bleeding, apply gauze and bandage.
    4. In case of arterial bleeding, press the artery with your finger or fist.
    5. In case of limb injuries, apply a tourniquet above the wound.
    `,
  },
  {
    id: '4',
    title: 'Burn',
    description: 'What to do in case of a burn',
    instructions: `
    1. Remove the damaging factor.
    2. Pour cool water over the burn.
    3. Do not smear with oil or cream.
    `,
  },
  {
    id: '5',
    title: 'Drowning',
    description: 'What to do in case of drowning',
    instructions: `
    1. Remove the victim from the water.
    2. Clear the airways.
    3. If there is no breathing and/or pulse, start indirect heart massage and artificial respiration.
    `,
  },
  {
    id: '6',
    title: 'Sunstroke',
    description: 'What to do in case of a sunstroke',
    instructions: `
    1. Move the victim to a cool place.
    2. Get rid of the clothes.
    3. Bring a wet towel to your nose.
    4. Do not smear with oil.
    `,
  },
  {
    id: '7',
    title: 'Frostbite',
    description: 'What to do in case of a frostbite',
    instructions: `
    1. Move the victim to a warm place.
    2. Rub the damaged areas with oil or vaseline.
    3. Provide hot food or hot drink.
    `,
  },
  {
    id: '8',
    title: 'Epileptic fainting',
    description: 'What to do in case of a epileptic fainting',
    instructions: `
    1. Do not restrain the victim.
    2. Put a soft pillow under your head.
    3. Unbutton the buttons or zipper on the neck and chest for easier breathing.
    `,
  },
  {
    id: '9',
    title: 'Earthquake',
    description: 'What to do during an earthquake',
    instructions: `
    1. If possible, fall down, covering your head and neck with your hands to protect yourself from collapsed objects.
    2. Beware of windows, glass doors and other breaking objects.
    3. If possible, get away from tall buildings, bridges and power lines.
    4. If you are inside the building, stay in place, move under a stable table or take cover against the wall, away from glass.
    5. If outside, avoid buildings, trees and pillars, so as not to expose yourself to the danger of collapse of structures.
    `,
  },
  {
    id: '10',
    title: 'Storm',
    description: 'What to do during a storm',
    instructions: `
    1. Listen to local weather warnings and follow the instructions of the authorities.
    2. In case of a tornado, seek shelter in the basement or inside residential buildings, away from windows.
    3. Prepare for evacuation if recommended.
    4. In case of a hurricane, close the windows and doors, and prepare food, water and other necessary supplies.
    5. If you have to be outside during a storm, look for a safe shelter, avoid large objects and easily rising objects.
    `,
  },
  {
    id: '11',
    title: 'Flood',
    description: 'What to do during a flood',
    instructions: `
    1. If possible, move away from high-risk areas to a safe place.
    2. Do not cross floodwaters on foot or by car, as they can be deceptively deep.
    3. Listen to local warnings and evacuation instructions.
    4. If you are in a car and the water starts to rise, immediately leave the car and go to a higher point.
    5. Prepare for the need for food, water and medical supplies in case of prolonged shelter.
    `,
  },
  {
    id: '12',
    title: 'Forest fire',
    description: 'What to do in case of a forest fire',
    instructions: `
    1. Follow local instructions and evacuation instructions.
    2. If possible, move away from the path of fire and smoke.
    3. Close windows and doors to prevent smoke from entering the room.
    4. Wear a mask or cloth to protect your lungs from smoke
    `,
  },
  {
    id: '13',
    title: 'Volcanic eruption',
    description: 'What to do in case of a volcanic eruption',
    instructions: `
    1. Follow the warnings and instructions of the authorities.
    2. Run away from the area of close impact of the eruption.
    3. Cover your nose and mouth to protect yourself from ash and gases.
    4. Close the windows and doors to avoid getting ash into the room.
    `,
  },
  // Add more dangerous situations here
];

export default function NavBar() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSituation, setSelectedSituation] = useState(null);
  
  const horizontalMargin = width * 0.36; // 50% of the screen width
  const horizontalMargin1 = width * 0.30; // 50% of the screen width
  const horizontalMargin2 = width * 0.80; // 50% of the screen width
  const verticalMargin = height * 0.05; // 50% of the screen width

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedSituation(null);
  };

  const handleCardPress = (situation) => {
    setSelectedSituation(situation);
    setModalVisible(true);
  };

  return (
    <>
      <View style={styles.statusBar} />
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => {
            // Handle navigation to the home screen here
          }}
        >
          <Text style={[styles.navText, {marginLeft: horizontalMargin}]}>Weelpy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{marginLeft: horizontalMargin1}}>
          {/* Use the Icon component */}
          <Icon name="warning" size={30} color="orange" />
        </TouchableOpacity>
      </View>
        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.container}>
            <View style={styles.modalContainer}>
              {selectedSituation ? (
                <View style={{ margin: 20, marginLeft: 30}}>
                  <Text style={styles.modalTitle}>{selectedSituation.title}</Text>
                  <Text style={styles.modalDescription}>
                    {selectedSituation.description}
                  </Text>
                  <Text style={styles.modalInstructions}>
                    {selectedSituation.instructions}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedSituation(null)}>
                    <Icon name="arrow-back" size={30} />
                  </TouchableOpacity>
                </View>
              ) : (
                <ScrollView>
                  {dangerousSituations.map((item) => (
                    <TouchableWithoutFeedback
                      onPress={() => handleCardPress(item)}
                      >
                      <Card style={{ backgroundColor: 'white', margin: 8, left: 5, borderColor: 5, borderRadius:2, width: horizontalMargin2, height: verticalMargin }}>
                        <Text style={{ color: 'gray', fontSize: 18, alignContent: 'center', alignSelf: 'center', marginTop: 7 }}>{item.title}</Text>
                      </Card>
                    </TouchableWithoutFeedback>
                ))}
                </ScrollView>)}
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ right: 20 }}>
              <Icon name="close" size={30} />
            </TouchableOpacity>
          </View>
        </Modal>
      {/* <View style={styles.container}> */}
      {/* </View> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'top',
  },
  modalContainer: {
    marginTop:20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalInstructions: {
    fontSize: 14,
    marginBottom: 20,
  },
  statusBar: {
    backgroundColor: 'gray', // If you want a status bar color, set it here
    height: '3%', // Adjust the height as needed
  },
  navBar: {
    
    backgroundColor: 'green', // Customize the background color
    height: 56, // Adjust the height as needed
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  navText: {
    fontSize: 24, // Adjust the font size
    color: 'white', // Customize the text color
    textAlign: 'center', // Center the text
  },
});
