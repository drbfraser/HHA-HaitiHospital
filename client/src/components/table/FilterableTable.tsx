import { Form, Table } from 'react-bootstrap';
import {
  Header,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

import Pagination from 'components/pagination/Pagination';
import cn from 'classnames';
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

const SortableHeader = (header: Header<any, any>, enableSorting: boolean = false) => {
  if (header.isPlaceholder) {
    return <th key={header.id}></th>;
  }

  const renderedFlex = flexRender(header.column.columnDef.header, header.getContext());
  const divProps = {
    style: { cursor: 'pointer' },
    onClick: header.column.getToggleSortingHandler(),
  };

  return (
    <th key={header.id}>
      {enableSorting && header.column.getCanSort() ? (
        <div {...divProps}>
          {renderedFlex}
          <i
            className={cn(
              'bi ms-2',
              {
                asc: 'bi-arrow-up',
                desc: 'bi-arrow-down',
              }[header.column.getIsSorted() as string] ?? 'bi-arrow-down-up',
            )}
          />
        </div>
      ) : (
        renderedFlex
      )}
    </th>
  );
};

const FilterableTable = ({
  data,
  columns,
  enableGlobalFilter = false,
  enableSorting = false,
}: Props) => {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns: columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    pageCount: Math.ceil(data.length / PAGE_SIZE),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: filterFn,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
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

      <Table hover className="mt-2">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => SortableHeader(header, enableSorting))}
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
