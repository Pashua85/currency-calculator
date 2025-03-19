import { createContext } from "react";
import { CalculatorStore } from "./CalculatorStore";

const CalculatorStoreContext = createContext<CalculatorStore | null>(null);

export default CalculatorStoreContext;