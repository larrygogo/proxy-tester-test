/* eslint-disable react/display-name */
import {ProxyDisplayInfo} from "@/types/proxy";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {TableVirtuoso, TableComponents} from 'react-virtuoso';
import React from "react";
import {alpha, Box, Button, Typography} from "@mui/material";
import ImportDialog from "@/components/ImportDialog";

interface ColumnData<T> {
  dataKey: keyof T;
  label: string;
  numeric?: boolean;
  width: number;
  epsilon?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

const columns: ColumnData<ProxyDisplayInfo>[] = [
  // {dataKey: 'id', label: 'ID', width: 50, render: (d, r, index) => <Typography color="green">{index + 1}</Typography>},
  {dataKey: 'host', label: 'Host', width: 100},
  {dataKey: 'port', label: 'Port', width: 50},
  {dataKey: 'username', label: 'Username', width: 100},
  {dataKey: 'password', label: 'Password', width: 100},
  {
    dataKey: 'status',
    label: 'Status',
    width: 80,
    render: (value) => value ? value !== 'fail' ? <Typography color="green">OK</Typography> :
      <Typography color="red">Fail</Typography> : ''
  },
  {
    dataKey: 'speed',
    label: 'Speed',
    width: 100,
    render: (value) => value !== 'fail' ? <Typography color="green">{value}</Typography> :
      <Typography color="red">Fail</Typography>
  },
]

const VirtuosoTableComponents: TableComponents<ProxyDisplayInfo> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} sx={{
      backgroundColor: theme => alpha(theme.palette.background.paper, 0.1),
    }}/>
  )),
  Table: (props) => (
    <Table
      {...props}
      size="small"
      sx={{
        borderCollapse: 'separate',
        tableLayout: 'fixed',
      }}

    />
  ),
  TableHead: (props) => (
    <TableHead {...props} sx={{
      backgroundColor: alpha('#fff', 0.1),
      // 背景模糊
      backdropFilter: 'blur(10px)',
      // 背景缩放
      '& > tr > th': {
        padding: '16px 16px',
        backgroundColor: 'transparent',
        color: '#fff',
      }
    }}
    />
  ),
  TableRow: ({item: _item, ...props}) => <TableRow {...props} sx={{color: '#fff'}}/>,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref}/>
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'left'}
          style={{width: column.width}}
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index: number, row: ProxyDisplayInfo) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? 'right' : 'left'}
          // 溢出
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <Typography noWrap>
            {column.render ? column.render(row[column.dataKey], row, _index) : row[column.dataKey]}
          </Typography>
        </TableCell>
      ))}
    </React.Fragment>
  );
}


type Props = {
  data: ProxyDisplayInfo[]
  renderEmpty?: () => JSX.Element
}

const ProxyVirtualizedTable = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const rows = props.data || []
  return (
    <Paper
      sx={(theme) => ({
        height: 300,
        width: '100%',
        overflowX: 'hidden',
        boxShadow: 'none',
        border: '1px solid rgba(224, 224, 224, 0.1)',
        borderRadius: 1,
        backgroundColor: 'transparent',
        flex: 1
      })}
    >
      {rows.length === 0 && props.renderEmpty ? props.renderEmpty() :
        <TableVirtuoso
          data={rows}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
          style={{
            boxShadow: 'none',
          }}
        />
      }
    </Paper>
  );
}

export default ProxyVirtualizedTable;