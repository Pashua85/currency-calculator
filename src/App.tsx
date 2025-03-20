import { AltCalculator } from './components/AltCalculator/AltCalculator';
import { Calculator } from './components/Calculator/Calculator';
import CalculatorStore from './store/CalculatorStore';
import CalculatorStoreContext from './store/CalculatorStoreContext';

const store = new CalculatorStore();

function App() {
  return (
    <CalculatorStoreContext.Provider value={store}>
      <Calculator />
      <AltCalculator />
    </CalculatorStoreContext.Provider>
  );
}

export default App;
