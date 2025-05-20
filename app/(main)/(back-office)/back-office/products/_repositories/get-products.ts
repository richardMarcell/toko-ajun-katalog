import { db } from "@/db";
import { products as productSchema } from "@/db/schema";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { PaginatedResponse } from "@/types/paginated-response";
import { Product } from "@/types/product";
import { count, like, or } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export async function getProducts({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams<{
    keyword: string;
  }>;
}): Promise<PaginatedResponse<{ products: Product[] }>> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  const keyword = searchParams.keyword ? searchParams.keyword : "";

  const totalProducts = await db
    .select({
      count: count(),
    })
    .from(productSchema)
    .where(
      or(
        like(productSchema.name, `%${keyword}%`),
        like(productSchema.code, `%${keyword}%`),
      ),
    );
  const totalData = totalProducts[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);
  const products = await db.query.products.findMany({
    where: or(
      like(productSchema.name, `%${keyword}%`),
      like(productSchema.code, `%${keyword}%`),
    ),
    offset: offset,
    limit: limit,
  });

  return {
    currentPageSize,
    currentPage,
    offset,
    lastPage,
    products,
  };
}
