import {ColumnDef} from "@tanstack/table-core";

export type ProxyDetail = {
  host: string;
  port: number;
  username: string;
  password: string;
  status: string;
  speed: number;
}

export const columns: ColumnDef<ProxyDetail>[] = [
  {
    accessorKey: 'host',
    header: 'Host',
  },
  {
    accessorKey: 'port',
    header: 'Port',
  },
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'password',
    header: 'Password',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'speed',
    header: 'Speed',
  }
]