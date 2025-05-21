import { db } from "@/db";
import { productCategories as productCategoriesSchema } from "@/db/schema";
import { BackOfficeSearchParams } from "@/types/back-office-search-params";
import { PaginatedResponse } from "@/types/paginated-response";
import { ProductCategory } from "@/types/product-category";
import { count, like, or } from "drizzle-orm";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export async function getProductCategories({
  searchParams,
}: {
  searchParams: BackOfficeSearchParams<{
    keyword: string;
  }>;
}): Promise<PaginatedResponse<{ productCategories: ProductCategory[] }>> {
  const currentPageSize = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const currentPage = Number(searchParams.page ?? DEFAULT_PAGE);
  const offset = (currentPage - 1) * currentPageSize;
  const limit = currentPageSize;

  const keyword = searchParams.keyword ? searchParams.keyword : "";

  const totalProductCategories = await db
    .select({
      count: count(),
    })
    .from(productCategoriesSchema)
    .where(or(like(productCategoriesSchema.name, `%${keyword}%`)));
  const totalData = totalProductCategories[0].count;

  const lastPage = Math.ceil(totalData / currentPageSize);
  const productCategories = await db.query.productCategories.findMany({
    where: or(like(productCategoriesSchema.name, `%${keyword}%`)),
    orderBy: (productCategories, { asc }) => asc(productCategories.id),
    offset: offset,
    limit: limit,
  });

  return {
    currentPageSize,
    currentPage,
    offset,
    lastPage,
    productCategories,
  };
}
