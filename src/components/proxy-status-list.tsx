import clsx from "clsx";
import {ProxyDisplayInfo} from "@/types/proxy";

type Props = {
  data: ProxyDisplayInfo[]
}

const ProxyStatusList = (props: Props) => {
  const {data} = props

  return (
    <div className="flex flex-col gap-2 px-4 pb-4">
      {data.map((_) => (
        <div key={_.id} className={clsx(
          "flex gap-4 justify-between text-sm border py-1.5 px-4 rounded-lg bg-gray-50",
          _.status === 'TIMEOUT' && 'bg-red-50 border-red-100',
        )}>
          <div className="truncate cursor-default" title={_.value}>
            {_.value}
          </div>
          <div className={clsx(
            "w-1/5 text-right",
            _.status !== 'OK' && _.speed !== undefined && 'text-red-700',
            _.status === 'OK' && _.speed !== undefined && 'text-green-700',
          )}>
            {_.speed !== undefined && _.speed !== null && `${_.speed}ms`}
            {_.speed !== undefined && _.speed === null && _.status}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProxyStatusList;