import { Form, Table } from 'react-bootstrap';
import {
  Header,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import Pagination from 'components/pagination/Pagination';
import cn from 'classnames';
import { useState } from 'react';

interface Props {
  data: any[];
  columns: any[];
  enableGlobalFilter?: boolean;
  enableFilters?: boolean;
  enableSorting?: boolean;
}

const PAGE_SIZE: number = 10;

const filterFn = (row, columnId, value) =>
  row.getValue(columnId).toLowerCase().includes(value.toLowerCase());

const equalFilterFn = (row, columnId, value) =>
  row.getValue(columnId).toLowerCase() === value.toLowerCase();

const startsWithFilterFn = (row, columnId, value) =>
  row.getValue(columnId).toLowerCase().startsWith(value.toLowerCase());

const endsWithFilterFn = (row, columnId, value) =>
  row.getValue(columnId).toLowerCase().endsWith(value.toLowerCase());

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
    <th key={header.id} className="align-text-top">
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
      {header.column.getCanFilter() && (
        <>
          <Form.Control
            type="text"
            onChange={(e) => header.column.setFilterValue(e.target.value)}
            placeholder={'Filter: ' + header.column.columnDef.header.toString()}
            className="my-2"
          />
          <Form.Select
            onChange={(e) => {
              switch (e.target.value) {
                case '1':
                  header.column.columnDef.filterFn = equalFilterFn;
                  break;
                case '2':
                  header.column.columnDef.filterFn = startsWithFilterFn;
                  break;
                case '3':
                  header.column.columnDef.filterFn = endsWithFilterFn;
                  break;
                default:
                  header.column.columnDef.filterFn = filterFn;
                  break;
              }
              header.column.setFilterValue(header.column.getFilterValue());
            }}
          >
            <option>Contains</option>
            <option value="1">Equals</option>
            <option value="2">Starts With</option>
            <option value="3">Ends With</option>
          </Form.Select>
        </>
      )}
    </th>
  );
};

// Referenced https://tanstack.com/table/v8/docs/api/features/filters to implement this component.
const FilterableTable = ({
  data,
  columns,
  enableGlobalFilter = false,
  enableFilters = false,
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
    enableFilters: enableFilters,
  });

  return (
    <div className="px-4 pt-3">
      {enableFilters && enableGlobalFilter && (
        <Form.Control
          type="text"
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Global Search"
          className="mb-3"
        />
      )}

      <Table hover>
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
        totalCount={table.getFilteredRowModel().rows.length}
        pageSize={table.getState().pagination.pageSize}
        onPageChange={(page) => table.setPageIndex(page - 1)}
      />
    </div>
  );
};

export default FilterableTable;
