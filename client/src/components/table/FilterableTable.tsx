import '@tanstack/react-table';

import {
  ColumnDef,
  Row,
  RowData,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Filter, { FILTER_DEFAULT_VALUE, FilterType, FilterValue } from '../filter/Filter';
import { useMemo, useState } from 'react';

import { EnumOption } from 'components/filter/EnumFilter';
import { FilterableHeader } from './FilterableHeader';
import Pagination from 'components/pagination/Pagination';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE: number = 10;

// This warning has to be ignored because the additional props do not use the Type Parameters but the declaration still needs them
declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    dataType?: FilterType;
    enumOptions?: EnumOption[];
    headerClasses?: string;
  }
}

export type FilterableColumnDef = ColumnDef<any, any>;

interface FilterableTableProps {
  data: any[];
  columns: FilterableColumnDef[];
  enableGlobalFilter?: boolean;
  enableFilters?: boolean;
  enableSorting?: boolean;
  rowClickHandler?: (row: any) => void;
  globalFilterType?: FilterType;
}

// Referenced https://tanstack.com/table/v8/docs/api/features/filters to implement this component.
const FilterableTable = ({
  data,
  columns,
  enableGlobalFilter = false,
  enableFilters = false,
  enableSorting = false,
  rowClickHandler,
  globalFilterType = FilterType.STRING,
}: FilterableTableProps) => {
  const { t } = useTranslation();

  const [globalFilter, setGlobalFilter] = useState<FilterValue>(
    FILTER_DEFAULT_VALUE[globalFilterType],
  );
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
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: 'includesString',
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    enableFilters: enableFilters,
    enableColumnResizing: false,
  });

  return (
    <div className="px-4 pt-3">
      {enableFilters && enableGlobalFilter && (
        <Filter
          placeholder={t('FilterableTable.GlobalSearch')}
          setFilterValue={setGlobalFilter}
          setFilterFn={(fn) => {
            table.options.globalFilterFn = fn;
          }}
          filterValue={globalFilter}
          type={globalFilterType}
        />
      )}

      <Table hover responsive>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) =>
                FilterableHeader({
                  header,
                  enableSorting,
                }),
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr data-test-id="row-data" key={row.id} {...getRowProps(row)}>
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
