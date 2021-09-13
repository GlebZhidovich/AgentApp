import { Injectable } from "@angular/core";


class TransportationConditions {
  pricePerKm: number;
  freeMaxWeight: number;
  pricePerKg: number;
  priceAfterFreeMax: number;
  maxWeight: number;
  age: number;
  sale: number;

  constructor(
    pricePerKm: number,
    freeMaxWeight: number,
    pricePerKg: number,
    priceAfterFreeMax: number,
    maxWeight: number,
    age: number = 0,
    sale: number = 0
  ) {
    this.pricePerKm = pricePerKm;
    this.freeMaxWeight = freeMaxWeight;
    this.pricePerKg = pricePerKg;
    this.priceAfterFreeMax = priceAfterFreeMax;
    this.maxWeight = maxWeight;
    this.age = age;
    this.sale = sale;
  }
}

interface CostConfig {
  economy: TransportationConditions
  advanced: TransportationConditions
  lux: TransportationConditions
}

interface CompaniesConfig {
  [k: string]: CostConfig;
}

type TypeConfig = keyof CostConfig;

@Injectable({
  providedIn: 'root',
})
export class CountService {
  private companies = ['RGD', 'AEROFLOT'];
  private types: TypeConfig[] = ['economy', 'advanced', 'lux'];
  private companiesConfig: CompaniesConfig = {
    AEROFLOT: {
      economy: new TransportationConditions(4, 5, 0, 4000, 20),
      advanced: new TransportationConditions(8, 20, 0, 5000, 50, 7, 30),
      lux: new TransportationConditions(15, 0, 0, 0, 50, 16, 30),
    },
    RGD: {
      economy: new TransportationConditions(0.5, 15, 1, 50, 50, 5, 50),
      advanced: new TransportationConditions(2, 20, 1, 50, 60, 8, 30),
      lux: new TransportationConditions(4, 0, 0, 0, 60),
    }
  }

  constructor() {
  }

  private getBaggagePrice(weight: number, config: TransportationConditions): number {
    if (weight < config.freeMaxWeight) {
      return 0;
    }
    if (config.pricePerKg) {
      return (weight - config.freeMaxWeight) * config.priceAfterFreeMax;
    }
    return config.priceAfterFreeMax;
  }


  private countPrice(variables: { distance: number, age: number, weight: number }, config: TransportationConditions): number {
    if (variables.weight > config.maxWeight) {
      return 0;
    }

    const distanceCost = variables.distance * config.pricePerKm;
    const distanceSalesCost = distanceCost * (variables.age < config.age ? config.sale / 100 : 0);

    const baggagePrice = this.getBaggagePrice(variables.weight, config);

    return distanceCost + baggagePrice - distanceSalesCost;
  }

  getPrice({ distance, age, weight }: { distance: number, age: number, weight: number }) {

    const result = this.companies.map(company => {
      const companyConfig = this.companiesConfig[company];
      if (companyConfig) {
        const result = this.types.map(type => {
          const config = companyConfig[type];
          if (config) {
            const variables = {
              distance,
              age,
              weight,
            }
            const price = this.countPrice(variables, config);
            return [type, price ? price : null]
          }
          return [companyConfig, null];
        }, this).filter(config => config[1]);
        return [company, result]
      }
      return [company, null]
    }, this).filter(company => company[1]);


    return result;
  }
}