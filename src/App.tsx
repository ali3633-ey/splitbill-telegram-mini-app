import { TelegramProvider } from './components/TelegramProvider';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CreateNameScreen } from './components/CreateNameScreen';
import { SelectModeScreen } from './components/SelectModeScreen';
import { AddParticipantsScreen } from './components/AddParticipantsScreen';
import { EnterAmountScreen } from './components/EnterAmountScreen';
import { ResultScreen } from './components/ResultScreen';
import { OCRScreen } from './components/OCRScreen';
import { FavoritesScreen } from './components/FavoritesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { useBillStore } from './store/useBillStore';

function App() {
  const currentScreen = useBillStore((state) => state.currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'create-name':
        return <CreateNameScreen />;
      case 'select-mode':
        return <SelectModeScreen />;
      case 'add-participants':
        return <AddParticipantsScreen />;
      case 'enter-amount':
        return <EnterAmountScreen />;
      case 'result':
        return <ResultScreen />;
      case 'ocr':
        return <OCRScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  const showBottomNav = ['welcome', 'ocr', 'favorites', 'profile'].includes(currentScreen);

  return (
    <TelegramProvider>
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#000000' }}>
        <main className="max-w-2xl w-full mx-auto py-8">
          {renderScreen()}
        </main>
        {showBottomNav && <BottomNavigation />}
      </div>
    </TelegramProvider>
  );
}

export default App;
