import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// 定义右键菜单项的类型
type MenuItem = {
  label: string;
  onClick: () => void;
};

// 定义右键菜单组件的属性类型
type ContextMenuProps = {
  menuItems: MenuItem[];
  children: React.ReactNode;
};

const ContextMenu: React.FC<ContextMenuProps> = ({ menuItems, children }) => {
  const [visible, setVisible] = useState(false); // 右键菜单是否可见
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 右键菜单的位置

  const contextMenuRef = useRef<HTMLDivElement>(null);

  // 处理右键菜单的显示
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // 阻止默认右键菜单的显示
    const posX = event.clientX;
    const posY = event.clientY;
    setVisible(true);
    setPosition({ x: posX, y: posY });
  };

  // 处理右键菜单的隐藏
  const handleContextMenuHide = () => {
    setVisible(false);
  };

  // 处理菜单项的点击
  const handleMenuItemClick = (onClick: () => void) => () => {
    handleContextMenuHide(); // 隐藏右键菜单
    onClick(); // 执行菜单项的点击事件处理函数
  };

  // 将右键菜单挂载到 body 下
  useEffect(() => {
    const handleBodyClick = () => {
      handleContextMenuHide();
    };
    document.body.addEventListener('click', handleBodyClick);
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, []);

  return (
    <>
      {/* 在需要显示右键菜单的组件上绑定右键菜单事件 */}
      <div onContextMenu={handleContextMenu}>{children}</div>

      {/* 使用 Portal 将右键菜单渲染到 body 下 */}
      {visible &&
        ReactDOM.createPortal(
          <div
            ref={contextMenuRef}
            style={{
              position: 'absolute',
              top: position.y,
              left: position.x,
              zIndex: 100,
              background: '#fff',
              boxShadow: '0px 0px 4px rgba(0,0,0,0.2)',
              padding: '8px 0',
            }}
          >
            {menuItems.map((item) => (
              <div
                key={item.label}
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  color: '#333',
                }}
                onClick={handleMenuItemClick(item.onClick)}
              >
                {item.label}
              </div>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};

export default ContextMenu;
