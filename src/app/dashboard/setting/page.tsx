'use client'
import Link from "next/link";
import {useEffect, useState} from "react";
import {Store} from "tauri-plugin-store-api";
import {emit} from "@tauri-apps/api/event";
import Tooltip from "@/components/tooltip";

export default function Page() {
  const [concurrentNumber, setConcurrentNumber] = useState<number>()

  useEffect(() => {
    (async () => {
      const store = new Store(".settings.dat")
      const taskConcurrency = await store.get("task.concurrency")
      if (typeof taskConcurrency === 'number') {
        setConcurrentNumber(taskConcurrency)
      }
    })()
  }, []);

  useEffect(() => {
    (async () => {
      if (concurrentNumber) {
        const store = new Store(".settings.dat")
        await store.set("task.concurrency", concurrentNumber)
        await emit("task_concurrency_change", concurrentNumber)
      }
    })();
  }, [concurrentNumber])

  return (
    <div>
      <div className="flex items-center justify-between bg-gray-100 border-b p-2">
        <div className="text-stone-800 font-bold p-2">
          Settings
        </div>
        <Link href={'/dashboard'}>
          <button className="p-1 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor"
                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </Link>
      </div>
      <div className="p-4">
        <div>
          <h4 className="text-gray-800 text-sm font-bold">
            <span>Concurrent Number</span>
            <span className="inline text-gray-400 pl-2">
              <Tooltip enterDelay breakContent width={320} label="The number of concurrent speed test tasks. If it is too large, it may affect the results.">
                <svg className="inline" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <g transform="rotate(180 12 12)">
                    <g fill="none">
                      <path
                        d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/>
                      <path fill="currentColor"
                            d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2Zm0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16Zm0 11a1 1 0 1 1 0 2a1 1 0 0 1 0-2Zm0-9a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Z"/>
                    </g>
                  </g>
                </svg>
              </Tooltip>
            </span>
          </h4>
          {/*  slider*/}
          <div className="flex items-center gap-2">
            <input
              type="range" min="1" max="100" step="1"
              className="w-52 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black/10 [&::-webkit-slider-runnable-track]:h-[6px] [&::-webkit-slider-thumb]:-mt-[4px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:w-[8px] [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:bg-blue-600/80"
              value={concurrentNumber} onChange={(e) => setConcurrentNumber(Number(e.target.value))}/>{/*  slider*/}
            <div className="w-12 text-center text-sm">
              {concurrentNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}