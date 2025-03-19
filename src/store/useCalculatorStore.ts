import { useContext } from "react";
import CalculatorStore from "./CalculatorStore";
import CalculatorStoreContext from "./CalculatorStoreContext";

export const useCalculatorStore = (): CalculatorStore => {
  const store = useContext(CalculatorStoreContext)

  if (!store) {
    throw new Error('CalculatorStoreContext не передан в контекст')
  }

  return store;
}