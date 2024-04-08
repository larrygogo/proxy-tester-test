interface TaskPoolOptions {
  concurrency?: number;
}

type EventHandler = (data?: Record<any, any>) => void;

type TaskEvent = {
  name: string;
  handler: EventHandler
};

export class TaskPool {
  private static instance: TaskPool;
  private concurrency: number;
  private activeCount: number;
  private taskQueue: (() => Promise<any>)[];
  private events: TaskEvent[];
  stopped: boolean;
  private completedCount: number;
  private allCount: number;

  // 单例模式
  private constructor(options: TaskPoolOptions = {}) {
    this.concurrency = options.concurrency ?? 20;
    this.activeCount = 0;
    this.taskQueue = [];
    this.events = [];
    this.stopped = true;
    this.completedCount = 0;
    this.allCount = 0;
  }

  public static getInstance(options?: TaskPoolOptions): TaskPool {
    if (!TaskPool.instance) {
      TaskPool.instance = new TaskPool(options);
    }
    return TaskPool.instance;
  }

  public addTask(task: () => Promise<any>) {
    this.taskQueue.push(() => Promise.resolve(task()));
    this.allCount++;
    return Promise.resolve();
  }

  public setConcurrency(concurrency: number) {
    this.concurrency = concurrency;
  }

  public async run() {
    while (!this.stopped) {
      if (this.activeCount < this.concurrency && this.taskQueue.length > 0) {
        const task = this.taskQueue.shift();
        if (task) {
          this.activeCount++;
          task()
            .finally(() => {
              this.completedCount++;
              this.activeCount--;
              if (!this.stopped) {
                this.triggerEvent('progress');
                if (this.activeCount === 0 && this.taskQueue.length === 0) {
                  this.stop()
                }
              }
            })
        }
      } else if (this.activeCount === 0 && this.taskQueue.length === 0) {
        this.triggerEvent('progress');
        break;
      } else {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
  }

  public async start() {
    if (this.stopped) {
      this.stopped = false;
      this.triggerEvent('start');
      await this.run();
    }
  }

  public stop() {
    if (!this.stopped) {
      this.stopped = true;
      console.log('taskPool stop111111');
      this.triggerEvent('stop');
    }
  }

  public on(name: string, handler: EventHandler) {
    this.events.push({
      name,
      handler,
    });
  }

  public clear() {
    this.activeCount = 0;
    this.taskQueue = [];
    this.events = [];
    this.stopped = true;
    this.completedCount = 0;
    this.allCount = 0;
  }

  private triggerEvent(name: string) {
    const events = this.events.filter(item => item.name === name);
    console.log('triggerEvent', name, events);
    for (let event of events) {
      switch (event.name) {
        case 'progress':
          event.handler({
            completed: this.completedCount,
            total: this.allCount,
          });
          break;
        case 'stop':
          event.handler();
          break;
        case 'start':
          event.handler();
          break;
      }
    }

  }
}

