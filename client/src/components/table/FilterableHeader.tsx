import Filter, { FILTER_DEFAULT_VALUE, FilterType, FilterValue } from '../filter/Filter';
import { Header, flexRender } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { EnumOption } from 'components/filter/EnumFilter';
import cn from 'classnames';
import { getDateFromDateStr } from 'utils';

export interface SortableHeaderProps {
  header: Header<any, any>;
  enableSorting: boolean;
  showAdvancedFilters?: boolean;
  toggleAdvancedFilters?: () => void;
}

export type ColumnMeta = {
  dataType: FilterType;
  enumOptions?: EnumOption[];
};

export const FilterableHeader = ({ header, enableSorting }: SortableHeaderProps) => {
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
