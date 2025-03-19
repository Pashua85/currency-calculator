import axiosInstance from "@/axiosIstance";
import { IN_AMOUNT_MAX, IN_AMOUNT_MIN, IN_AMOUNT_STEP, OUT_AMOUNT_STEP, PAIR_ID, REQUEST_DELAY_MS } from "@/constants";
import { AmountTypes } from "@/enums";
import { CalcRequestData, CalcResponseData } from "@/interfaces";
import { FetchData } from "@/types";
import { delay } from "@/utils";
import { AxiosResponse } from "axios";
import debounce from 'lodash/debounce';
import Decimal from "decimal.js-light";
import { action, makeAutoObservable, makeObservable, observable } from "mobx";
import { throttle } from "lodash";

export class CalculatorStore {
  public inAmountString = '0';

  public outAmountString =  '0';

  public inAmountMin = IN_AMOUNT_MIN;

  public inAmountMax = IN_AMOUNT_MAX;

  public outAmountMin: number | null = null;

  public outAmountMax: number | null = null;

  public isLoaderVisible = true;

  public decimalLimitIn = 0;

  public decimalLimitOut = 0;

  public stepIn = IN_AMOUNT_STEP;

  public stepOut = OUT_AMOUNT_STEP;

  // public throttledInputChange: (value: string, amountType: AmountTypes) => void;

  private lastActualPrice: [string, string] | null = null;

  private throttledOnAmountChange: (value: number, amountType: AmountTypes) => void;


  constructor() {
    makeAutoObservable(this);

    this.throttledOnAmountChange = throttle(this.onAmountChange, REQUEST_DELAY_MS);
    
    this.setDecimalLimits();

    this.setOutAmountRange(true);
    
  }

  public handleInputChange = (value: string, amountType: AmountTypes) => {
    const numericNewValue = parseFloat(value);  
    const isNewValueNaN = isNaN(numericNewValue);

    if (isNewValueNaN && amountType === AmountTypes.IN_AMOUNT) {
      this.inAmountString = this.inAmountMin.toString();
      this.throttledOnAmountChange(this.inAmountMin, amountType);
      return;
    }

    if (isNewValueNaN && amountType === AmountTypes.OUT_AMOUNT) {
      this.inAmountString = (this.outAmountMin ?? 0).toString();
      this.throttledOnAmountChange(this.outAmountMin ?? 0, amountType);
      return;
    }

    if (amountType === AmountTypes.IN_AMOUNT) {
      this.inAmountString = value;
    }

    if (amountType === AmountTypes.OUT_AMOUNT) {
      this.outAmountString = value;
    }

    this.throttledOnAmountChange(numericNewValue, amountType);
  };

  private calculateValue = (options: {   min: number;
    max: number;
    percent: number;
    precision?: number;}): string => {
    // Проверка, чтобы процент был в диапазоне от 0 до 100
    if (options.percent < 0 || options.percent > 100) {
      throw new Error('Процент должен быть от 0 до 100');
    }
  
    const minDecimal = new Decimal(options.min.toString());
    const maxDecimal = new Decimal(options.max.toString());
    const percentDecimal = new Decimal(options.percent.toString());
  
    const value = minDecimal.add(maxDecimal.sub(minDecimal).mul(percentDecimal.div(100)));
  
    // Установка точности, если указана
    if (options.precision !== undefined) {
      Decimal.set({ precision: options.precision });
    }
  
    // Округление результата до указанной точности
    const roundedValue = value.toDecimalPlaces(options.precision);
  
    return roundedValue.toString();
  }



  private onAmountChange = async (value: number, amountType: AmountTypes) => {
    const requestData = this.prepareData(value, amountType);
    const data = await this.fetchData(requestData);

    if (!data) {
      return;
    }

    if (amountType === AmountTypes.IN_AMOUNT) {
      this.outAmountString = data.outAmount;
    }

    if (amountType === AmountTypes.OUT_AMOUNT) {
      this.inAmountString = data.inAmount;
    }
  }

  private setDecimalLimits = () => {
    this.decimalLimitIn  = this.stepIn.toString().split('.')[1]?.length ?? 0;
    this.decimalLimitOut = this.stepOut.toString().split('.')[1]?.length ?? 0;

    console.log({ limitIn: this.decimalLimitIn, limitOut: this.decimalLimitOut});
  }

  private setOutAmountRange = async (withSetInitValues = false) => {
    const requestDataForMin = this.prepareData(this.inAmountMin, AmountTypes.IN_AMOUNT);
    const dataForMin = await this.fetchData(requestDataForMin);

    if (!this.lastActualPrice && dataForMin) {
      this.lastActualPrice = dataForMin.price;
    }

    await delay(REQUEST_DELAY_MS);

    const requestDataForMax = this.prepareData(this.inAmountMax, AmountTypes.IN_AMOUNT);
    const dataForMax = await this.fetchData(requestDataForMax);

    this.isLoaderVisible = false;

    if (!dataForMin || !dataForMax) {
      return;
    }

    this.outAmountMin = Number(dataForMin.outAmount);
    this.outAmountMax = Number(dataForMax.outAmount);

    if (withSetInitValues) {
      this.inAmountString = dataForMin.inAmount;
      this.outAmountString = dataForMin.outAmount;
    }
  }

  private prepareData = (value: number, amountType: AmountTypes): FetchData => {
    const restAmount = amountType === AmountTypes.IN_AMOUNT ? AmountTypes.OUT_AMOUNT : AmountTypes.IN_AMOUNT;
    return { [amountType]: value, [restAmount]: null};
  }

  private async fetchData(data: FetchData): Promise<CalcResponseData | null> {
    try {

      const resp = await axiosInstance.post<CalcResponseData, AxiosResponse<CalcResponseData>, CalcRequestData>(
        '/b2api/change/user/pair/calc', {
          pairId: PAIR_ID,
          ...data,
      })
    
      console.log({respFromStore: resp});

      return resp.data;
    } catch(err) {
      console.error('Не удалось получить данные', err)
      return null
    }
  }
}

export default CalculatorStore;

// "pairId": 133,
// "inAmount": 1,
// "outAmount": null,