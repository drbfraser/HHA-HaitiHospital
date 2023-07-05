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
import Filter, { FILTER_DEFAULT_VALUE, FilterType, FilterValue } from '../filter/Filter';
import { useEffect, useMemo, useState } from 'react';

import { EnumOption } from 'components/filter/EnumFilter';
import Pagination from 'components/pagination/Pagination';
import { Table } from 'react-bootstrap';
import cn from 'classnames';
import { getDateFromDateStr } from 'utils';

const PAGE_SIZE: number = 10;

interface SortableHeaderProps {
  header: Header<any, any>;
  enableSorting: boolean;
  showAdvancedFilters?: boolean;
  toggleAdvancedFilters?: () => void;
}

export type ColumnMeta = {
  dataType: FilterType;
  enumOptions?: EnumOption[];
};

const SortableHeader = ({ header, enableSorting }: SortableHeaderProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

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

  const firstValue = header
    .getContext()
    .table.getPreFilteredRowModel()
    .flatRows[0]?.getValue(header.column.columnDef.id) as string;

  const columnMeta = header.column.columnDef.meta as ColumnMeta;

  let columnType = columnMeta?.dataType;
  let enumOptions = columnMeta?.enumOptions ?? [];

  if (!columnType && firstValue) {
    const date = getDateFromDateStr(firstValue);
    const number = Number(firstValue);

    if (date && !isNaN(date.getTime())) {
      columnType = FilterType.DATE;
    } else if (!isNaN(number)) {
      columnType = FilterType.NUMBER;
    }
  }

  columnType = columnType ?? FilterType.STRING;

  const [filterValue, setFilterValue] = useState<FilterValue>(FILTER_DEFAULT_VALUE[columnType]);

  useEffect(() => {
    header.column.setFilterValue(filterValue);
  }, [filterValue, header.column]);

  if (header.isPlaceholder) {
    return <th key={header.id}></th>;
  }

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
          placeholder: 'Filter: ' + header.column.columnDef.header.toString(),
          setFilterValue,
          filterValue,
          setFilterFn: (fn) => (header.column.columnDef.filterFn = fn),
          allowFilterFnChange: true,
          type: columnType,
          enumOptions: enumOptions,
        })}
    </th>
  );
};

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
          placeholder="Global Search"
          setFilterValue={setGlobalFilter}
          setFilterFn={(fn) => {
            table.options.globalFilterFn = fn;
          }}
          filterValue={globalFilter}
          type={globalFilterType}
          allowFilterFnChange
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
