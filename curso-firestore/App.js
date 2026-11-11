import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import AnalisesScreen from './src/screens/AnalisesScreen';
import CalendarioScreen from './src/screens/CalendarioScreen';
import HomeScreen from './src/screens/HomeScreen';
import AtividadesScreen from './src/screens/AtividadesScreen';
import NovaAtividadeModal from './src/components/NovaAtividadeModal';
import { AtividadesProvider } from './src/context/AtividadesContext';

const Tab = createBottomTabNavigator();

export default function App() {
  const [formularioAberto, setFormularioAberto] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <AtividadesProvider>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Início"
            tabBar={(props) => (
              <View style={styles.tabBarWrapper}>
                <BottomTabBar {...props} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Cadastrar nova atividade"
                  style={styles.fab}
                  onPress={() => setFormularioAberto(true)}
                >
                  <Ionicons name="add" size={30} color="#FFFFFF" />
                </Pressable>
              </View>
            )}
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarActiveTintColor: '#B99AFF',
              tabBarInactiveTintColor: '#8290A8',
              tabBarStyle: styles.tabBar,
              tabBarLabelStyle: styles.tabLabel,
              tabBarIcon: ({ color, size, focused }) => {
                const icons = {
                  'Início': focused ? 'home' : 'home-outline',
                  'Calendário': focused ? 'calendar' : 'calendar-outline',
                  'Atividades': focused ? 'document-text' : 'document-text-outline',
                  'Análises': focused ? 'stats-chart' : 'stats-chart-outline',
                };

                return <Ionicons name={icons[route.name]} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name="Início" component={HomeScreen} />
            <Tab.Screen name="Calendário" component={CalendarioScreen} />
            <Tab.Screen name="Atividades" component={AtividadesScreen} />
            <Tab.Screen name="Análises" component={AnalisesScreen} />
          </Tab.Navigator>
        </NavigationContainer>
        <NovaAtividadeModal
          visible={formularioAberto}
          onClose={() => setFormularioAberto(false)}
        />
      </AtividadesProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08111F',
  },
  tabBar: {
    backgroundColor: '#0A1426',
    borderTopColor: 'rgba(149, 163, 190, 0.18)',
    height: 62,
    paddingTop: 5,
    paddingBottom: 5,
  },
  tabBarWrapper: {
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    top: -15,
    left: '50%',
    width: 50,
    height: 50,
    marginLeft: -27,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27,
    backgroundColor: '#8B5CF6',
    borderWidth: 4,
    borderColor: '#0A1426',
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});
