import axiosInstance from '@/axiosIstance';
import {
  IN_AMOUNT_MAX,
  IN_AMOUNT_MIN,
  IN_AMOUNT_STEP,
  OUT_AMOUNT_STEP,
  PAIR_ID,
  REQUEST_DELAY_MS,
} from '@/constants';
import { AmountTypes } from '@/enums';
import { CalcByPercentageData, CalcPercentageByValueData, CalcRequestData, CalcResponseData } from '@/interfaces';
import { FetchData } from '@/types';
import { delay } from '@/utils';
import { AxiosResponse } from 'axios';
import Decimal from 'decimal.js-light';
import { makeAutoObservable } from 'mobx';
import { isEqual, throttle } from 'lodash';

export class CalculatorStore {
  public inAmountString = '0';

  public outAmountString = '0';

  public inAmountMin = IN_AMOUNT_MIN;

  public inAmountMax = IN_AMOUNT_MAX;

  public outAmountMin: number | null = null;

  public outAmountMax: number | null = null;

  public isLoaderVisible = true;

  public decimalLimitIn = 0;

  public decimalLimitOut = 0;

  public percentageIn = 0;

  public percentageOut = 0;

  public stepIn = IN_AMOUNT_STEP;

  public stepOut = OUT_AMOUNT_STEP;

  /** Актуальный курс по которому приходили последние данные */
  private lastActualPrice: [string, string] | null = null;

  private throttledOnAmountChange: (value: number, amountType: AmountTypes) => void;

  constructor() {
    makeAutoObservable(this);

    this.throttledOnAmountChange = throttle(this.onAmountChange, REQUEST_DELAY_MS);

    this.setDecimalLimits();

    this.setOutAmountRange(true);
  }

  /**
   * Обработчик изменения значения в инпуте
   * 
   * @param {string} value - новое значение инпута
   * @param {AmountTypes} amountType - Тип количества (отдаваемое или получаемое).
   */
  public handleInputChange = (value: string, amountType: AmountTypes) => {
    const numericNewValue = parseFloat(value);
    const isNewValueNaN = isNaN(numericNewValue);

    if (isNewValueNaN && amountType === AmountTypes.IN_AMOUNT) {
      this.inAmountString = this.inAmountMin.toString();
      this.throttledOnAmountChange(this.inAmountMin, amountType);
      this.percentageIn = 0;
      return;
    }

    if (isNewValueNaN && amountType === AmountTypes.OUT_AMOUNT) {
      this.inAmountString = (this.outAmountMin ?? 0).toString();
      this.throttledOnAmountChange(this.outAmountMin ?? 0, amountType);
      this.percentageOut = 0;
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

  /**
   * Обрабатывает изменение процента для указанного типа количества.
   * 
   * @param {number} value - Новое значение процента.
   * @param {AmountTypes} amountType - Тип количества (отдаваемое или получаемое).
   */
  public handlePercentageChange = (value: number, amountType: AmountTypes) => {
    if (amountType === AmountTypes.IN_AMOUNT) {
      this.percentageIn = value;
    }

    if (amountType === AmountTypes.OUT_AMOUNT) {
      this.percentageOut = value;
    }
    const data: Record<AmountTypes, CalcByPercentageData> = {
      [AmountTypes.IN_AMOUNT]: {
        min: this.inAmountMin,
        max: this.inAmountMax,
        percent: value,
        precision: this.decimalLimitIn,
      },
      [AmountTypes.OUT_AMOUNT]: {
        min: this.outAmountMin ?? 0,
        max: this.outAmountMax ?? 0,
        percent: value,
        precision: this.decimalLimitOut,
      },
    };

    const newValue = this.calculateValueFromPercent(data[amountType]);

    this.handleInputChange(newValue, amountType);
  };

  /**
   * Высчитывает числовое значение из диапазона на основе процента
   * @param {CalcByPercentageData} options - Содержит min, max, percent, и шаг шаг точности.
   * @returns {string} Получаемое значение.
   */
  private calculateValueFromPercent = ({ percent, max, min, precision }: CalcByPercentageData): string => { 
    if (percent < 0 || percent > 100) {
      throw new Error('Процент должен быть от 0 до 100');
    }
  
    const minDecimal = new Decimal(min.toString());
    const maxDecimal = new Decimal(max.toString());
    const percentDecimal = new Decimal(percent.toString());
  
    const value = minDecimal.add(maxDecimal.sub(minDecimal).mul(percentDecimal.div(100)));
  
    const decimalPlaces = precision ?? 0; 
  
    const roundedValue = value.toDecimalPlaces(decimalPlaces);
  
    return roundedValue.toString();
  };

  /**
   * Рассчитывает процент значения в указанном диапазоне.
   * 
   * @param {CalcPercentageByValueData} options - Содержит минимальное значение, максимальное значение, значение и необязательную точность.
   * @returns {number} Рассчитанный процент.
   */
  private calculatePercentageByValue = ({ min, max, precision, value}: CalcPercentageByValueData): number => {

    if (value < min) {
      value = min;
    }

    if (value > max) {
      value = max;
    }
  
    const valueDecimal = new Decimal(value.toString());
    const minDecimal = new Decimal(min.toString());
    const maxDecimal = new Decimal(max.toString());
  
    const range = maxDecimal.sub(minDecimal);
    const percentage = valueDecimal.sub(minDecimal).div(range).mul(100);
  
    // Округление результата до указанной точности
    if (precision !== undefined) {
      const roundedPercentage = percentage.toDecimalPlaces(precision);
      return roundedPercentage.toNumber();
    } else {
      return percentage.toNumber();
    }
  }

  /**
   * Обрабатывает изменение числового значения для указанного типа количества и обновляет связанные данные.
   * 
   * @param {number} value - Новое значение количества.
   * @param {AmountTypes} amountType - Тип количества (входящее или отдаваемое).
   */
  private onAmountChange = async (value: number, amountType: AmountTypes) => {
    const requestData = this.prepareData(value, amountType);
    const data = await this.fetchData(requestData);

    if (!data) {
      return;
    }

    const percentageCalcData: Record<AmountTypes, CalcPercentageByValueData> = {
      [AmountTypes.IN_AMOUNT]: {
        min: this.inAmountMin,
        max: this.inAmountMax,
        value: Number(data.inAmount),
        precision: 4,
      },
      [AmountTypes.OUT_AMOUNT]: {
        min: this.outAmountMin ?? 0,
        max: this.outAmountMax ?? 1000,
        value: Number(data.outAmount),
        precision: 4,
      }
    }

    if (amountType === AmountTypes.IN_AMOUNT) {
      this.outAmountString = data.outAmount;
      this.percentageOut  = this.calculatePercentageByValue(percentageCalcData[AmountTypes.OUT_AMOUNT]);
    }

    if (amountType === AmountTypes.OUT_AMOUNT) {
      this.inAmountString = data.inAmount;
      this.percentageIn  = this.calculatePercentageByValue(percentageCalcData[AmountTypes.IN_AMOUNT]);
    }

    /** В случае изменения курса происходит перерасчет диапазона получаемого количества */
    if (this.lastActualPrice && !isEqual(this.lastActualPrice, data.price)) {
      this.setOutAmountRange();
    }
  };

  /**
   * Устанавливает ограничения на количество десятичных знаков в полях.
   */
  private setDecimalLimits = () => {
    this.decimalLimitIn = this.stepIn.toString().split('.')[1]?.length ?? 0;
    this.decimalLimitOut = this.stepOut.toString().split('.')[1]?.length ?? 0;
  };

  /**
   * Устанавливает диапазон получаемого количества на основе минимального и максимального значений отдаваемого количества.
   * 
   * @param {boolean} [withSetInitValues=false] - Флаг для установки начальных значений входящего или отдаваемого количества.
   */
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
  };

  /**
   * Подготавливает данные для запроса.
   */
  private prepareData = (value: number, amountType: AmountTypes): FetchData => {
    const restAmount =
      amountType === AmountTypes.IN_AMOUNT ? AmountTypes.OUT_AMOUNT : AmountTypes.IN_AMOUNT;
    return { [amountType]: value, [restAmount]: null };
  };

  /**
   * 
   * Получение данных с расчетом по курсу
   * @param {FetchData} data - Данные для отправки в запросе.
   * @returns {Promise<CalcResponseData | null>} Обещание с данными ответа или null в случае ошибки.
   */
  private async fetchData(data: FetchData): Promise<CalcResponseData | null> {
    try {
      const resp = await axiosInstance.post<
        CalcResponseData,
        AxiosResponse<CalcResponseData>,
        CalcRequestData
      >('/b2api/change/user/pair/calc', {
        pairId: PAIR_ID,
        ...data,
      });

      return resp.data;
    } catch (err) {
      console.error('Не удалось получить данные', err);
      return null;
    }
  }
}

export default CalculatorStore;
