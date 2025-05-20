"use client";

import { SwimsuitRentTemporary } from "@/types/domains/swimsuit-rent/general";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type SwimsuitRentContextType = {
  swimsuitRentTemporaryInput: SwimsuitRentTemporary;
  setSwimsuitRentTemporaryInput: Dispatch<
    SetStateAction<SwimsuitRentTemporary>
  >;
  saleDetailProductQtyMap: Map<number, number>;
  initialSwimsuitRentTemporaryValues: SwimsuitRentTemporary;
};

const initialSwimsuitRentTemporaryValues = {
  customer_name: "",
  customer_phone_number: "",
  discount_percent: 0,
  discount_amount: 0,
  tax_percent: 0,
  tax_amount: 0,
  sales_details: [],
  total_gross: 0,
  total_net: 0,
  grand_total: 0,
  created_at: new Date(),
};

const SwimsuitRentContext = createContext<SwimsuitRentContextType | null>(null);

export function SwimsuitRentProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const initValue = sessionStorage.getItem("swimsuit-rent-temporary")
      ? JSON.parse(sessionStorage.getItem("swimsuit-rent-temporary") as string)
      : initialSwimsuitRentTemporaryValues;
    setSwimsuitRentTemporaryInput(initValue);
  }, []);

  const [swimsuitRentTemporaryInput, setSwimsuitRentTemporaryInput] =
    useState<SwimsuitRentTemporary>(initialSwimsuitRentTemporaryValues);

  const saleDetailProductQtyMap = new Map(
    swimsuitRentTemporaryInput.sales_details.map((detail) => [
      detail.product_id,
      detail.qty,
    ]),
  );

  return (
    <SwimsuitRentContext.Provider
      value={{
        swimsuitRentTemporaryInput,
        setSwimsuitRentTemporaryInput,
        saleDetailProductQtyMap,
        initialSwimsuitRentTemporaryValues,
      }}
    >
      {children}
    </SwimsuitRentContext.Provider>
  );
}

export function useSwimsuitRentContext() {
  const context = useContext(SwimsuitRentContext);

  if (!context) {
    throw new Error(
      "useSwimsuitRentContext must be used within a SwimsuitRentProvider",
    );
  }
  return context;
}
