import { create } from 'zustand';
import { CalculationResult, Country } from '@/types/income';

interface IncomeStore {
  // State
  koreaIncome: number;
  usIncome: number;
  selectedCountry: Country;
  koreaResult: CalculationResult | null;
  usResult: CalculationResult | null;
  isAnalyzing: boolean;

  // Actions
  setKoreaIncome: (income: number) => void;
  setUsIncome: (income: number) => void;
  setSelectedCountry: (country: Country) => void;
  setKoreaResult: (result: CalculationResult | null) => void;
  setUsResult: (result: CalculationResult | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  reset: () => void;
}

const useIncomeStore = create<IncomeStore>((set) => ({
  // Initial state
  koreaIncome: 0,
  usIncome: 0,
  selectedCountry: 'korea',
  koreaResult: null,
  usResult: null,
  isAnalyzing: false,

  // Actions
  setKoreaIncome: (income) => set({ koreaIncome: income }),
  setUsIncome: (income) => set({ usIncome: income }),
  setSelectedCountry: (country) => set({ selectedCountry: country }),
  setKoreaResult: (result) => set({ koreaResult: result }),
  setUsResult: (result) => set({ usResult: result }),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

  reset: () => set({
    koreaIncome: 0,
    usIncome: 0,
    selectedCountry: 'korea',
    koreaResult: null,
    usResult: null,
    isAnalyzing: false,
  }),
}));

export default useIncomeStore;