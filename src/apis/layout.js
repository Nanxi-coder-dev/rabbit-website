import httpInstance from "@/utils/http";

/**
 * @description: 获取首页分类导航数据
 * @param {*}
 * @return {*}
 */
export function getCategoryAPI() {
  return httpInstance.get("/home/category/head");
}
