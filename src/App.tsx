import { AltCalculator } from './components/AltCalculator/AltCalculator';
import CalculatorStore from './store/CalculatorStore';
import CalculatorStoreContext from './store/CalculatorStoreContext';

const store = new CalculatorStore();

function App() {
  return (
    <CalculatorStoreContext.Provider value={store}>
      <AltCalculator />
    </CalculatorStoreContext.Provider>
  );
}

export default App;
