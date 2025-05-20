type QueryObject = Record<string, string | number | bigint | boolean | null>;

export default class RecordNotFoundError<
  T extends QueryObject = QueryObject,
> extends Error {
  table: string;
  readonly query: string;

  constructor({
    table,
    query,
    message,
  }: {
    table: string;
    query: T;
    message?: string;
  }) {
    super(message || `No record found in "${table}" matching query.`);
    this.name = "RecordNotFoundError";
    this.table = table;
    this.query = JSON.stringify(query);

    Object.setPrototypeOf(this, RecordNotFoundError.prototype);
  }
}
