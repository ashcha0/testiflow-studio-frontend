import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  // 系统配置
  const apiKey = ref('')
  const apiBaseUrl = ref((import.meta as any).env.VITE_APP_API_BASE_URL || '/api')
  const isDarkMode = ref(false)
  
  // 设置API密钥
  function setApiKey(key: string) {
    apiKey.value = key
    localStorage.setItem('api_key', key)
  }
  
  // 加载API密钥
  function loadApiKey() {
    const savedKey = localStorage.getItem('api_key')
    if (savedKey) {
      apiKey.value = savedKey
    }
  }
  
  // 切换暗黑模式
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('dark_mode', isDarkMode.value ? '1' : '0')
  }
  
  // 初始化配置
  function initConfig() {
    loadApiKey()
    const darkMode = localStorage.getItem('dark_mode')
    if (darkMode) {
      isDarkMode.value = darkMode === '1'
    }
  }
  
  return {
    apiKey,
    apiBaseUrl,
    isDarkMode,
    setApiKey,
    loadApiKey,
    toggleDarkMode,
    initConfig
  }
})