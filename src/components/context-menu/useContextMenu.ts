import React, { useState, useEffect } from 'react';

interface ContextMenuState {
  show: boolean;
  setShow: (show: boolean) => void;
  x: number;
  y: number;
}

export default function useContextMenu(containerRef: React.RefObject<HTMLElement>): ContextMenuState {
  const [show, setShow] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);


  useEffect(() => {
    const div = containerRef.current;
    const showMenu = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setShow(true);
      setX(event.clientX);
      setY(event.clientY);
    };

    const closeMenu = () => {
      setShow(false);
    };

    div?.addEventListener('contextmenu', showMenu);
    window?.addEventListener('click', closeMenu);
    window?.addEventListener('contextmenu', closeMenu, true);
    return () => {
      div?.removeEventListener('contextmenu', showMenu);
      window?.removeEventListener('click', closeMenu);
      window?.removeEventListener('contextmenu', closeMenu);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在组件挂载和卸载时添加/移除事件监听

  return {
    show,
    setShow,
    x,
    y,
  };
}