import { ProductConfig } from "@/lib/config/product-config";

const ticketProductConfig = ProductConfig.ticket;

export function getTicketWeekdayProductIds(): bigint[] {
  return [
    ticketProductConfig.anak_dewasa_weekday.id,
    ticketProductConfig.anak_kurang_80cm.id,
    ticketProductConfig.lansia.id,
  ];
}

export function getTicketWeekendProductIds(): bigint[] {
  return [
    ticketProductConfig.anak_dewasa_weekend.id,
    ticketProductConfig.anak_kurang_80cm.id,
    ticketProductConfig.lansia.id,
  ];
}

export function getTicketOnlineProductIds(): bigint[] {
  return [
    ticketProductConfig.anak_dewasa_online.id,
  ];
}

export function getAllTicketProductIds(): bigint[] {
  return [
    ticketProductConfig.anak_dewasa_weekday.id,
    ticketProductConfig.anak_dewasa_weekend.id,
    ticketProductConfig.anak_dewasa_online.id,
    ticketProductConfig.anak_kurang_80cm.id,
    ticketProductConfig.lansia.id,
  ];
}
