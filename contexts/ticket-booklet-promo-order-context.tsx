"use client";

import { SalesTemporary } from "@/types/domains/tickets-booklet-promo/sales/general";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type TicketOrderContextType = {
  ticketSalesTemporaryInput: SalesTemporary;
  setTicketSalesTemporaryInput: Dispatch<SetStateAction<SalesTemporary>>;
  initialTicketSalesTemporary: SalesTemporary;
  ticketQtyMap: Map<number, number>;
};

const initialTicketSalesTemporary: SalesTemporary = {
  customer_name: "",
  customer_phone_number: "",
  customer_origin_id: null,
  tax_percent: 0,
  tax_amount: 0,
  discount_amount: 0,
  discount_percent: 0,
  total_gross: 0,
  total_net: 0,
  grand_total: 0,
  sales_details: [],
  is_festive: false,

  wristband_qty: 0,
  total_deposit: 0,
  wristband_code_list: [],
};

const TicketOrderContext = createContext<TicketOrderContextType | null>(null);

export function TicketOrderProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const initValue = sessionStorage.getItem(
      "ticket-booklet-promo-sales-temporary",
    )
      ? JSON.parse(
          sessionStorage.getItem(
            "ticket-booklet-promo-sales-temporary",
          ) as string,
        )
      : initialTicketSalesTemporary;
    setTicketSalesTemporaryInput(initValue);
  }, []);

  const [ticketSalesTemporaryInput, setTicketSalesTemporaryInput] =
    useState<SalesTemporary>(initialTicketSalesTemporary);

  const ticketQtyMap = new Map(
    ticketSalesTemporaryInput.sales_details.map((detail) => [
      Number(detail.product_id),
      detail.qty,
    ]),
  );

  return (
    <TicketOrderContext.Provider
      value={{
        ticketSalesTemporaryInput,
        setTicketSalesTemporaryInput,
        initialTicketSalesTemporary,
        ticketQtyMap,
      }}
    >
      {children}
    </TicketOrderContext.Provider>
  );
}

export function useTicketOrderContext() {
  const context = useContext(TicketOrderContext);

  if (!context) {
    throw new Error(
      "useTicketOrderContext must be used within a TicketOrderProvider",
    );
  }
  return context;
}
