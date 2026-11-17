// 通过幂集算法，生成当前规格的全部可选项[蓝色]-[20cm] -> [[蓝色],[20cm],[[蓝色],[20cm]]]
// selectedValArr 字符串数组["blue", "20cm", "China"]
// 幂集算法
export default function bwPowerSet(selectedValArr) {
  const selectSubSet = [];
  let cur = [];

  // 回溯法实现
  const backTrack = (index) => {
    for (let i = index; i < selectedValArr.length; i++) {
      cur.push(selectedValArr[i]); // 进行选择
      selectSubSet.push([...cur]); // 保存结果
      backTrack(i + 1); // 下一层选择
      cur.pop(); // 撤销选择
    }
  };
  backTrack(0);
  return selectSubSet;
}
