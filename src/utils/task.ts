interface TaskPoolOptions {
  concurrency?: number;
}

interface ProgressEventData {
  completed: number;
  total: number;
}

type EventHandler<T> = (data: T) => void;

export class TaskPool {
  private static instance: TaskPool;
  private concurrency: number;
  private activeCount: number;
  private taskQueue: (() => Promise<any>)[];
  private progressHandlers: EventHandler<ProgressEventData>[];
  stopped: boolean;
  private completedCount: number;
  private allCount: number;

  // 使用单例模式
  private constructor(options: TaskPoolOptions = {}) {
    this.concurrency = options.concurrency ?? 20;
    this.activeCount = 0;
    this.taskQueue = [];
    this.progressHandlers = [];
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

  public async start() {
    this.stopped = false;
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
                this.triggerProgressEvent();
              }
            })
        }
      } else if (this.activeCount === 0 && this.taskQueue.length === 0) {
        this.triggerProgressEvent();
        break;
      } else {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
  }

  public stop() {
    this.stopped = true;
  }

  public on(event: 'progress', handler: EventHandler<ProgressEventData>) {
    this.progressHandlers.push(handler);
  }

  public clear() {
    this.activeCount = 0;
    this.taskQueue = [];
    this.progressHandlers = [];
    this.stopped = true;
    this.completedCount = 0;
    this.allCount = 0;
  }

  private triggerProgressEvent() {
    const data: ProgressEventData = {
      completed: this.completedCount,
      total: this.allCount,
    };

    this.progressHandlers.forEach(handler => handler(data));
  }
}

