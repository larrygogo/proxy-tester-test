import React, {useRef, useState} from "react";
import {useFloating, autoUpdate, arrow, offset, flip, shift, useHover, useClick, useInteractions, FloatingArrow} from '@floating-ui/react';
import {Transition} from "@headlessui/react";

type TooltipProps = {
  children: React.ReactNode
  // label can be a function that returns a ReactNode
  label: React.ReactNode | (() => React.ReactNode)
  placement?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: ('hover' | 'click')[]
  enterDelay?: boolean
  width?: number
  breakContent?: boolean
}

export default function Tooltip(props: TooltipProps) {
  const [open, setOpen] = useState<boolean>(false)
  const arrowRef = useRef(null);
  const {refs, floatingStyles, context} = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(0), flip(), shift(), arrow({
      element: arrowRef,
    })],
    whileElementsMounted: autoUpdate,
    placement: props.placement || 'top',
  })

  const hover = useHover(context, {move: false})
  const click = useClick(context)
  let propsList = []
  const trigger = props.trigger || ['hover']
  if (trigger.includes('hover')) {
    propsList.push(hover)
  }
  if (trigger.includes('click')) {
    propsList.push(click)
  }

  const {getReferenceProps, getFloatingProps} = useInteractions(propsList)

  return (
    <div className="inline-flex font-sans cursor-pointer">
      <div
        className="inline tooltip-button"
        ref={refs.setReference}
        {...getReferenceProps()}
        onClick={() => setOpen(!open)}
      >
        {props.children}
      </div>
      <Transition
        show={open}
        enter={"transition duration-200 ease-out" + (props.enterDelay ? " delay-300" : "")}
        enterFrom="transform scale-50 opacity-0"
        enterTo="transform scale-95 opacity-100"
        leave="transition duration-200 ease-out"
        leaveFrom="transform scale-95 opacity-100"
        leaveTo="transform scale-50 opacity-0"
      >
        <div
          // 不换行
          className={"absolute z-1000 bg-gray-900/90 text-white font-normal text-xs rounded-lg px-4 py-2.5 whitespace-nowrap" + (props.breakContent ? "whitespace-nowrap" : "")}
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            width: props.width || 'auto'
          }}
          {...getFloatingProps()}>
          <FloatingArrow ref={arrowRef} context={context} width={6} height={3}/>
          {typeof props.label === 'function' ? props.label() : props.label}
        </div>
      </Transition>
    </div>
  )
}