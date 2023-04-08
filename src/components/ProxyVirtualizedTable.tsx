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
import {Typography} from "@mui/material";

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
    <TableContainer component={Paper} {...props} ref={ref}/>
  )),
  Table: (props) => (
    <Table {...props} sx={{borderCollapse: 'separate', tableLayout: 'fixed'}} size="small"/>
  ),
  TableHead,
  TableRow: ({item: _item, ...props}) => <TableRow {...props} />,
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
}

const ProxyVirtualizedTable = (props: Props) => {
  const rows = props.data || []
  return (
    <Paper
      sx={(theme) => ({
        height: 300,
        width: '100%',
        mt: 6,
        overflowX: 'hidden',
        boxShadow: 'none',
        border: '1px solid rgba(224, 224, 224, 1)',
      })}
    >
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
        style={{
          boxShadow: 'none',
        }}
      />
    </Paper>
  );
}

export default ProxyVirtualizedTable;