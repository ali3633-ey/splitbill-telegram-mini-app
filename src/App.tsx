import { TelegramProvider } from './components/TelegramProvider';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CreateNameScreen } from './components/CreateNameScreen';
import { AddParticipantsScreen } from './components/AddParticipantsScreen';
import { EnterAmountScreen } from './components/EnterAmountScreen';
import { ResultScreen } from './components/ResultScreen';
import { useBillStore } from './store/useBillStore';

function App() {
  const currentScreen = useBillStore((state) => state.currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'create-name':
        return <CreateNameScreen />;
      case 'add-participants':
        return <AddParticipantsScreen />;
      case 'enter-amount':
        return <EnterAmountScreen />;
      case 'result':
        return <ResultScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <TelegramProvider>
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}>
        <main className="max-w-2xl w-full mx-auto py-8">
          {renderScreen()}
        </main>
      </div>
    </TelegramProvider>
  );
}

export default App;
