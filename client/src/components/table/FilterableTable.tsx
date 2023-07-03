import { Button, Form, InputGroup, Table } from 'react-bootstrap';
import {
  ColumnDef,
  Header,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Filter, { stringFilterFn } from './Filter';
import { useEffect, useMemo, useState } from 'react';

import Pagination from 'components/pagination/Pagination';
import cn from 'classnames';

const PAGE_SIZE: number = 10;

interface SortableHeaderProps {
  header: Header<any, any>;
  enableSorting: boolean;
  showAdvancedFilters?: boolean;
  toggleAdvancedFilters?: () => void;
}

const SortableHeader = ({ header, enableSorting }: SortableHeaderProps) => {
  const [filterValue, setFilterValue] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  useEffect(() => {
    header.column.setFilterValue(filterValue);
  }, [filterValue, header.column]);

  if (header.isPlaceholder) {
    return <th key={header.id}></th>;
  }

  const renderedFlex = flexRender(header.column.columnDef.header, header.getContext());
  const divProps = {
    style: { cursor: 'pointer' },
    onClick: header.column.getToggleSortingHandler(),
  };

  const advancedFilterProps = showAdvancedFilters
    ? {
        className: 'bi bi-funnel-fill',
        title: 'Hide Advanced Filters',
      }
    : {
        className: 'bi bi-funnel',
        title: 'Show Advanced Filters',
      };

  return (
    <th key={header.id} className="align-text-top">
      {enableSorting && header.column.getCanSort() ? (
        <div className="d-flex">
          <span {...divProps}>
            {renderedFlex}
            <i
              className={cn(
                'bi ms-2',
                {
                  asc: 'bi-sort-up',
                  desc: 'bi-sort-down',
                }[header.column.getIsSorted() as string] ?? 'bi-arrow-down-up',
              )}
            />
          </span>
          <span className="ms-auto me-2" style={{ cursor: 'pointer' }}>
            <i
              {...advancedFilterProps}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            />
          </span>
        </div>
      ) : (
        renderedFlex
      )}
      {header.column.getCanFilter() &&
        showAdvancedFilters &&
        Filter({
          placeholder: 'Filter' + header.column.columnDef.header.toString(),
          setFilterValue,
          filterValue,
          setFilterFn: (fn) => (header.column.columnDef.filterFn = fn),
          allowFilterFnChange: true,
        })}
    </th>
  );
};

export type FilterableColumnDef = ColumnDef<any, any>;

interface Props {
  data: any[];
  columns: FilterableColumnDef[];
  enableGlobalFilter?: boolean;
  enableFilters?: boolean;
  enableSorting?: boolean;
  rowClickHandler?: (row: any) => void;
}

// Referenced https://tanstack.com/table/v8/docs/api/features/filters to implement this component.
const FilterableTable = ({
  data,
  columns,
  enableGlobalFilter = false,
  enableFilters = false,
  enableSorting = false,
  rowClickHandler,
}: Props) => {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const getRowProps = useMemo(() => {
    if (rowClickHandler) {
      return (row: Row<any>) => ({
        onClick: () => rowClickHandler(row.original),
        style: { cursor: 'pointer' },
      });
    }

    return (_: Row<any>) => ({});
  }, [rowClickHandler]);

  const table = useReactTable({
    columns: columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    pageCount: Math.ceil(data.length / PAGE_SIZE),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: stringFilterFn.contains,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    enableFilters: enableFilters,
    enableColumnResizing: false
  });

  return (
    <div className="px-4 pt-3">
      {enableFilters && enableGlobalFilter && (
        <Filter
          placeholder="Global Search"
          setFilterValue={setGlobalFilter}
          filterValue={globalFilter}
        />
      )}

      <Table hover responsive>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) =>
                SortableHeader({
                  header,
                  enableSorting,
                }),
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} {...getRowProps(row)}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(
            (footerGroup) =>
              footerGroup.headers.some((header) => header.column.columnDef.footer) && (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(header.column.columnDef.footer, header.getContext())}
                    </th>
                  ))}
                </tr>
              ),
          )}
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
