import httpInstance from "@/utils/http";

/**
 * @description: 获取banner轮播图
 * @param {Object} params { distributionSite: 1=首页 2=商品页 }
 * @return {*}
 */
export const getBannerAPI = (params = {}) => {
  // 默认为1（首页），商品页为2
  const { distributionSite = "1" } = params;
  return httpInstance({
    url: "/home/banner",
    params: { distributionSite },
  });
};

/**
 * @description: 获取新鲜好物
 * @param {*}
 * @return {*}
 */
export function findNewAPI() {
  return httpInstance.get("/home/new");
}

/**
 * @description: 获取人气推荐
 * @param {*}
 * @return {*}
 */
export const getHotAPI = () => {
  return httpInstance.get("home/hot");
};

/**
 * @description: 获取所有商品模块
 * @param {*}
 * @return {*}
 */
export const getGoodsAPI = () => {
  return httpInstance.get("home/goods");
};
