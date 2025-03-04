/**
 * 脚本编辑器工具函数
 */

// 计算脚本大致时长（基于字数）
export const calculateScriptDuration = (text: string): number => {
  // 假设每分钟说150个字
  const wordsPerMinute = 150;
  const words = text.trim().split(/\s+/).length;
  const minutes = words / wordsPerMinute;
  return Math.round(minutes * 60); // 转换为秒
};

// 格式化脚本文本
export const formatScriptText = (text: string): string => {
  // 简单格式化，去除多余空行等
  return text
    .replace(/\n{3,}/g, '\n\n') // 将3个以上连续换行替换为2个
    .trim();
};

// 提取脚本中的关键词
export const extractKeywords = (text: string): string[] => {
  // 这里是一个简单实现，实际项目中可能需要更复杂的算法
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = ['的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'];
  
  // 过滤掉停用词和短词
  const filteredWords = words.filter(word => 
    word.length > 1 && !stopWords.includes(word)
  );
  
  // 计算词频
  const wordFreq: Record<string, number> = {};
  filteredWords.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  // 按频率排序并返回前10个
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);
};

// 检查脚本质量
export const checkScriptQuality = (text: string): {
  score: number;
  suggestions: string[];
} => {
  const suggestions: string[] = [];
  let score = 100;
  
  // 检查长度
  if (text.length < 100) {
    score -= 20;
    suggestions.push('脚本内容过短，建议扩充内容');
  }
  
  // 检查段落
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  if (paragraphs.length < 3) {
    score -= 10;
    suggestions.push('段落数量较少，建议增加内容结构');
  }
  
  // 检查重复词
  const words = text.toLowerCase().split(/\s+/);
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    if (word.length > 2) { // 只检查长度大于2的词
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  const repeatedWords = Object.entries(wordFreq)
    .filter(([_, count]) => count > 5)
    .map(([word]) => word);
  
  if (repeatedWords.length > 3) {
    score -= 15;
    suggestions.push(`存在过多重复词语: ${repeatedWords.slice(0, 3).join(', ')}等`);
  }
  
  return {
    score: Math.max(0, score),
    suggestions: suggestions.length > 0 ? suggestions : ['脚本质量良好']
  };
};