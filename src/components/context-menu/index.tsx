import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import {Box, MenuList, MenuItem, useTheme, SxProps, Fade} from "@mui/material";
import useContextMenu from "@/components/context-menu/useContextMenu";
import {isClient} from "@/utils/utils";
import {Theme} from "@mui/material/styles";
import Paper from "@mui/material/Paper";

// 定义右键菜单项的类型
type MenuItem = {
  label: string;
  value: string;
};

// 定义右键菜单组件的属性类型
type ContextMenuProps = {
  menuItems: MenuItem[];
  onSelect: (value: string) => void;
  children: React.ReactNode;
  sx?: SxProps<Theme>
  menuProps?: {
    sx?: SxProps<Theme>
  },
  component?: React.ElementType<any> | (React.ElementType<any> & undefined)
  [key: string]: any;
};

const ContextMenu: React.FC<ContextMenuProps> = (props: ContextMenuProps) => {
  const {menuItems, onSelect, children, sx, menuProps, component, ...otherProps} = props;
  const theme = useTheme();
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const {show, setShow, x, y} = useContextMenu(contextMenuRef)

  const wrapper = component ? component : 'div';

  const handleSelect = (value: string) => {
    onSelect(value);
    setShow(false);
  }

  return (
    <>
      <Box
        ref={contextMenuRef}
        sx={sx}
        component={wrapper}
        {...otherProps}
      >
        {children}
      </Box>
      {isClient() && show && ReactDOM.createPortal(
        <Fade in={show}>
          <Paper
              sx={{
                position: 'fixed',
                top: y,
                left: x,
                zIndex: theme.zIndex.tooltip,
                ...menuProps?.sx
              }}
            >
              <MenuList
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
              >
                {menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      handleSelect(item.value)
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
        </Fade>
        ,
        document.body
      )}
    </>
  );
};

export default ContextMenu;
