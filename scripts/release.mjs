import { execSync } from "node:child_process"
import fs from "node:fs"
import { createRequire } from "node:module"

import updatelog from "./updatelog.mjs"

const require = createRequire(import.meta.url)

async function release() {
  const flag = process.argv[2] ?? "patch"
  const type = process.argv[3] ?? "release"
  const packageJson = require("../package.json")
  let [a, b, c] = packageJson.version.split(".").map(Number)

  const validType = ["release", "beta", "alpha"]

  if (flag === "major") {
    // 主版本
    a += 1
    b = 0
    c = 0
  } else if (flag === "minor") {
    // 次版本
    b += 1
    c = 0
  } else if (flag === "patch") {
    // 补丁版本
    c += 1
  } else {
    console.log(`Invalid flag "${flag}"`)
    process.exit(1)
  }

  if (!validType.includes(type)) {
    console.log(`Invalid type "${type}"`)
    process.exit(1)
  }

  const typeSuffix = type === "release" ? "" : `-${type}`

  const nextVersion = `${a}.${b}.${c}${typeSuffix}`
  packageJson.version = nextVersion

  const nextTag = `v${nextVersion}`
  await updatelog(nextTag, "release")

  // 将新版本写入 package.json 文件
  fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2))

  // 提交修改的文件，打 tag 标签（tag 标签是为了触发 github action 工作流）并推送到远程
  execSync("git add ./package.json ./UPDATE_LOG.md")
  execSync(`git commit -m "v${nextVersion}"`)
  execSync(`git tag -a v${nextVersion} -m "v${nextVersion}"`)
  execSync("git push")
  execSync(`git push origin v${nextVersion}`)
  console.log("Publish Successfully...")
}

release().catch(console.error)
