/**
 * Type declarations for node-cron v4
 * The @types/node-cron package is for v3, so we need custom types
 */

declare module 'node-cron' {
  export interface ScheduledTask {
    start(): void;
    stop(): void;
    execute(): Promise<unknown>;
    destroy(): void;
    getStatus(): 'idle' | 'running' | 'stopped' | 'destroyed';
    getNextRun(): Date | null;
    on(event: string, listener: (...args: unknown[]) => void): this;
    off(event: string, listener: (...args: unknown[]) => void): this;
    once(event: string, listener: (...args: unknown[]) => void): this;
  }

  export interface TaskOptions {
    name?: string;
    timezone?: string;
    noOverlap?: boolean;
    maxExecutions?: number;
    maxRandomDelay?: number;
  }

  export interface ScheduleContext {
    date: Date;
    dateLocalIso: string;
    triggeredAt: Date;
    task: ScheduledTask;
    execution?: {
      reason: 'scheduled' | 'manual' | 'init';
      result?: unknown;
      error?: Error;
    };
  }

  export function schedule(
    expression: string,
    func: (context: ScheduleContext) => void | Promise<void>,
    options?: TaskOptions
  ): ScheduledTask;

  export function validate(expression: string): boolean;

  export function getTasks(): Map<string, ScheduledTask>;
}