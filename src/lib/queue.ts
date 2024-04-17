interface TaskPoolOptions {
  concurrency?: number
}

export class Queue {
  stopped: boolean
  completedCount: number
  allCount: number
  private concurrency: number
  private activeCount: number
  private taskQueue: (() => Promise<unknown>)[]

  constructor(options: TaskPoolOptions = {}) {
    this.concurrency = options.concurrency ?? 20
    this.activeCount = 0
    this.taskQueue = []
    this.stopped = true
    this.completedCount = 0
    this.allCount = 0
  }

  onStart: () => void = () => {}

  onStop: () => void = () => {}

  public addTask(task: () => Promise<unknown>) {
    this.taskQueue.push(() => Promise.resolve(task()))
    this.allCount++
  }

  public async run() {
    while (!this.stopped) {
      if (this.activeCount < this.concurrency && this.taskQueue.length > 0) {
        const task = this.taskQueue.shift()
        if (task) {
          this.activeCount++
          task()
            .catch((e) => {
              console.log("task catch error")
              console.error(e)
            })
            .finally(() => {
              this.completedCount++
              this.activeCount--
              if (!this.stopped) {
                if (this.completedCount === this.allCount) {
                  this.stop()
                }
              }
            })
        }
      } else if (this.activeCount === 0 && this.taskQueue.length === 0) {
        break
      } else {
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
    }
  }

  public async start() {
    if (this.stopped) {
      this.stopped = false
      this.onStart()
      await this.run()
    }
  }

  public stop() {
    if (!this.stopped) {
      this.stopped = true
      this.onStop()
    }
  }
}
