import { emit } from "@tauri-apps/api/event"
import { createDir, readDir, readTextFile, writeFile } from "@tauri-apps/api/fs"
import { appConfigDir, resolve } from "@tauri-apps/api/path"

export type Language = "en" | "zh"

export interface AppConfig {
  language: Language
}

export type AppConfigKey = keyof AppConfig

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
    // 判断是否存在文件夹
    const configDirExists = await directoryExists(configDir)
    if (!configDirExists) {
      // 创建文件夹
      await createDir(configDir)
    }
    this.configPath = await resolve(configDir, "config.json")
    // 判断是否存在文件夹

    try {
      const config = await readTextFile(this.configPath)
      console.log("config", config)
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
      console.log("newKeys", this.config)
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

  async set<K extends keyof AppConfig>(key: K, value: AppConfig[K]) {
    this.config[key] = value
    await emit("config_update", this.config)
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

/** 判断文件夹是否存在 */
async function directoryExists(path: string): Promise<boolean> {
  try {
    await readDir(path)
    return true
  } catch {
    return false
  }
}

export default new Config()
