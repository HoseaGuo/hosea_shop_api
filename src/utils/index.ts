import { Model } from "mongoose";

// 判断是否是超级管理员
export function isSuperAdmin(username: string) {
  const adminUsernameArray = ["admin"];
  return adminUsernameArray.includes(username);
}

type QueryOptions = {
  pageSize?: number;
  pageNum?: number;
  [key: string]: any;
};

export async function pagingQuery(
  model: Model<any>,
  queryOptions: QueryOptions
): Promise<{ list: any[]; total: number }> {
  const { pageSize = 10, pageNumber = 1, ...rest } = queryOptions;

  const queryList = model
    .find(rest)
    .limit(pageSize)
    .skip(pageSize * (pageNumber - 1));

  const queryCount = model.find(rest).count();

  // @ts-ignore
  let [listRes, countRes] = await Promise.allSettled([queryList, queryCount]);

  return {
    // @ts-ignore
    list: listRes.value,
    // @ts-ignore
    total: countRes.value,
  };
}
