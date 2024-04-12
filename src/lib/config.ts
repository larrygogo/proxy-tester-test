import { readTextFile, writeFile } from "@tauri-apps/api/fs"
import { appConfigDir, resolve } from "@tauri-apps/api/path"

export type Language = "en" | "zh"

export interface AppConfig {
  language: Language
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  language: "en",
}

export class Config {
  private config: AppConfig = DEFAULT_APP_CONFIG
  private configPath = ""

  constructor() {
    this.init()
  }

  async init() {
    const configDir = await appConfigDir()
    this.configPath = await resolve(configDir, "config.json")
    // 判断是否存在文件夹

    console.log("this.configPath", this.configPath)
    try {
      const config = await readTextFile(this.configPath)
      const newKeys = Object.keys(DEFAULT_APP_CONFIG).filter(
        (key) => !Object.keys(JSON.parse(config)).includes(key),
      )
      this.config = {
        ...DEFAULT_APP_CONFIG,
        ...JSON.parse(config),
        // clear missing keys
        ...newKeys.reduce((acc: Record<string, unknown>, key) => {
          acc[key] = undefined
          return acc
        }, {}),
      }
      await this.save()
    } catch (e) {
      console.error(e)
      this.config = DEFAULT_APP_CONFIG
      await this.save()
    }
  }

  getConfig(): AppConfig {
    return this.config
  }

  get(key: keyof AppConfig): AppConfig[keyof AppConfig] | null {
    return this.config[key] || null
  }

  set<K extends keyof AppConfig>(key: K, value: AppConfig[K]) {
    this.config[key] = value
  }

  async save() {
    try {
      await writeFile({
        path: this.configPath,
        contents: JSON.stringify(this.config, null, 2),
      })
    } catch (e) {
      console.error(e)
    }
  }
}

export default new Config()
