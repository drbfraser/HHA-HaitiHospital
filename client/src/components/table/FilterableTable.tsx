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
import { useEffect, useMemo, useState } from 'react';

import Pagination from 'components/pagination/Pagination';
import cn from 'classnames';

const PAGE_SIZE: number = 10;

const filterFn = (row, columnId, value) =>
  row.getValue(columnId).toLowerCase().includes(value.toLowerCase());

const equalFilterFn = (row, columnId, value) =>
  row.getValue(columnId).toLowerCase() === value.toLowerCase();

const startsWithFilterFn = (row, columnId, value) =>
  row.getValue(columnId).toLowerCase().startsWith(value.toLowerCase());

const endsWithFilterFn = (row, columnId, value) =>
  row.getValue(columnId).toLowerCase().endsWith(value.toLowerCase());

const Filter = ({ header, setFilterValue, filterValue }) => (
  <>
    <InputGroup className="my-2">
      <Form.Control
        type="text"
        onChange={(e) => {
          setFilterValue(e.target.value);
        }}
        value={filterValue}
        placeholder={'Filter: ' + header.column.columnDef.header.toString()}
      />
      {filterValue && (
        <Button
          size="sm"
          variant="light text-danger"
          onClick={() => setFilterValue('')}
          title="clear"
        >
          &#x2715;
        </Button>
      )}
    </InputGroup>
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
);

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
        Filter({ header, setFilterValue, filterValue })}
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

    return (row: Row<any>) => ({});
  }, [rowClickHandler]);

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
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            onChange={(e) => setGlobalFilter(e.target.value)}
            value={globalFilter}
            placeholder="Global Search"
          />
          {globalFilter && (
            <Button variant="light text-danger" onClick={() => setGlobalFilter('')} title="clear">
              &#x2715;
            </Button>
          )}
        </InputGroup>
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
            <tr data-testid="view-biomech-report" key={row.id} {...getRowProps(row)}>
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
