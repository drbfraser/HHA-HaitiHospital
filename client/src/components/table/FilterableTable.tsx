import { Form, Table } from 'react-bootstrap';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import Pagination from 'components/pagination/Pagination';
import { useState } from 'react';

interface Props {
  data: any[];
  columns: any[];
  enableGlobalFilter?: boolean;
  enableSorting?: boolean;
}

const PAGE_SIZE: number = 10;
const filterFn = (row, columnId, value) =>
  row.getValue(columnId).toLowerCase().includes(value.toLowerCase());

const FilterableTable = ({
  data,
  columns,
  enableGlobalFilter = false,
  enableSorting = false,
}: Props) => {
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const table = useReactTable({
    columns: columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    pageCount: Math.ceil(data.length / PAGE_SIZE),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: filterFn,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="p-4">
      {enableGlobalFilter && (
        <Form.Control
          type="text"
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search"
          className="mt-2"
        />
      )}

      <Table hover className='mt-2'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </Table>
      <Pagination
        className="pagination-bar"
        currentPage={table.getState().pagination.pageIndex + 1}
        totalCount={data.length}
        pageSize={table.getState().pagination.pageSize}
        onPageChange={(page) => table.setPageIndex(page - 1)}
      />
    </div>
  );
};

export default FilterableTable;
