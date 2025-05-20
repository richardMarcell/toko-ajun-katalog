import { Sales } from "@/types/domains/tickets-online/sales/general";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type TicketOrderContextType = {
  ticketSalesInput: Sales;
  setTicketSalesInput: Dispatch<SetStateAction<Sales>>;
  initialTicketSales: Sales;
  ticketQtyMap: Map<number, number>;
};

const initialTicketSales: Sales = {
  customer_name: "",
  customer_phone_number: "",
  customer_origin_id: null,
  sales_details: [],

  ota_redeem_code: "",
  vendor_type_code: "",
};

const TicketOrderContext = createContext<TicketOrderContextType | null>(null);

export function TicketOrderProvider({ children }: { children: ReactNode }) {
  const [ticketSalesInput, setTicketSalesInput] =
    useState<Sales>(initialTicketSales);

  const ticketQtyMap = new Map(
    ticketSalesInput.sales_details.map((detail) => [
      Number(detail.product_id),
      detail.qty,
    ]),
  );

  return (
    <TicketOrderContext.Provider
      value={{
        ticketSalesInput,
        setTicketSalesInput,
        initialTicketSales,
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
