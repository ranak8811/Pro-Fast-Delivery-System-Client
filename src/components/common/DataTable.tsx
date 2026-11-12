import React, { ReactNode } from "react";
import Pagination, { PaginationProps } from "./Pagination";
import { FaInbox } from "react-icons/fa";

export interface ColumnDef<T> {
  header: ReactNode;
  accessorKey?: keyof T;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  emptySubtext?: string;
  emptyIcon?: ReactNode;
  emptyAction?: ReactNode;
  pagination?: PaginationProps;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = "No records found",
  emptySubtext,
  emptyIcon,
  emptyAction,
  pagination,
  className = "",
}: DataTableProps<T>): React.ReactElement {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200 ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={`th-${idx}`}
                  scope="col"
                  className={`px-5 py-3.5 whitespace-nowrap ${col.headerClassName || col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={`skeleton-row-${rIdx}`} className="animate-pulse">
                  {columns.map((col, cIdx) => (
                    <td key={`skeleton-cell-${cIdx}`} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State Row
              <tr>
                <td colSpan={columns.length} className="px-6 py-14 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3.5">
                      {emptyIcon || <FaInbox className="text-2xl" />}
                    </div>
                    <h4 className="text-base font-semibold text-slate-800 mb-1">
                      {emptyMessage}
                    </h4>
                    {emptySubtext && (
                      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                        {emptySubtext}
                      </p>
                    )}
                    {emptyAction && <div className="mt-1">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            ) : (
              // Real Data Rows
              data.map((item, rowIdx) => (
                <tr
                  key={keyExtractor(item, rowIdx)}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {columns.map((col, colIdx) => {
                    const value = col.render
                      ? col.render(item, rowIdx)
                      : col.accessorKey
                      ? (item[col.accessorKey] as unknown as ReactNode)
                      : null;

                    return (
                      <td
                        key={`cell-${rowIdx}-${colIdx}`}
                        className={`px-5 py-3.5 align-middle ${col.className || ""}`}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && <Pagination {...pagination} />}
    </div>
  );
}

export default DataTable;
