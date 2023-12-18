import {Slot} from "@radix-ui/react-slot";
import {cn} from "@/lib/utils";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

export function PageContainer(props: PageContainerProps) {
  const Comp = props.asChild ? Slot : "div"

  return (
    <Comp
      {...props}
      tauri-drag-region={true}
      className={cn(
        props?.className,
        "rounded-lg bg-white"
      )}>
      {props.children}
    </Comp>
  )
}


export interface PageContainerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

export function PageContainerHeader(props: PageContainerHeaderProps) {
  const Comp = props.asChild ? Slot : "div"
  return (
    <Comp {...props} className={cn(
      props?.className,
      "p-4 rounded-t-lg border-b"
    )}>
      {props.children}
    </Comp>
  )
}

export interface PageContainerTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

export function PageContainerTitle(props: PageContainerTitleProps) {
  const Comp = props.asChild ? Slot : "div"
  return (
    <Comp {...props} className={cn(
      "text-2xl font-semibold",
      props?.className,
    )}>
      {props.children}
    </Comp>
  )
}

export interface PageContainerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

export function PageContainerContent(props: PageContainerContentProps) {
  const Comp = props.asChild ? Slot : "div"
  return (
    <Comp
      {...props}
      tauri-drag-region={true}
      className={cn(
      props?.className,
      "p-4"
    )}>
      {props.children}
    </Comp>
  )
}
