import React, {useRef, useState} from "react";
import {useFloating, autoUpdate, arrow, offset, flip, shift, useHover, useClick, useInteractions, FloatingArrow} from '@floating-ui/react';
import {Transition} from "@headlessui/react";

type TooltipProps = {
  children: React.ReactNode
  label: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: ('hover' | 'click')[]
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
    <div className="flex font-sans cursor-pointer z-50">
      <div
        className="tooltip-button"
        ref={refs.setReference}
        {...getReferenceProps()}
        onClick={() => setOpen(!open)}
      >
        {props.children}
      </div>
      <Transition
        show={open}
        enter="transition duration-200 ease-out delay-300"
        enterFrom="transform scale-50 opacity-0"
        enterTo="transform scale-95 opacity-100"
        leave="transition duration-200 ease-out"
        leaveFrom="transform scale-95 opacity-100"
        leaveTo="transform scale-50 opacity-0"
      >
        <div
          // 不换行
          className="bg-black rounded px-4 py-2 text-xs text-white/90 shadow tooltip-content whitespace-nowrap"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}>
          <FloatingArrow ref={arrowRef} context={context} width={6} height={3}/>
          {props.label}
        </div>
      </Transition>
    </div>
  )
}