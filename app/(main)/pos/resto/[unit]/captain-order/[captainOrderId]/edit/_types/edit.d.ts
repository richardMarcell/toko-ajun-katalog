import { CaptainOrder } from "@/types/captain-order";
import { CaptainOrderDetail } from "@/types/captain-order-detail";
import { Product } from "@/types/product";
import { Room } from "@/types/room";
import { Table } from "@/types/table";
import { User } from "@/types/user";

export type CaptainOrderDetailIncludeRelationship = CaptainOrderDetail & {
  product: Product;
};

export type CaptainOrderIncludeRelationship = CaptainOrder & {
  captainOrderDetails: CaptainOrderDetailIncludeRelationship[];
  table?: Table | null;
  room?: Room | null;
  userCreator: User;
};
