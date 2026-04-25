/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Loader, PlusCircleIcon, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import TableSkeleton from "./table-skeleton-loader";
import { DataTablePagination } from "./table-pagination";
import { EmptyState } from "../empty-state";

interface ColumnMeta {
  mobileHidden?: boolean;
  mobileLabel?: string;
}

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  searchPlaceholder?: string;
  showSearch?: boolean;
  filters?: FilterOption[];
  className?: string;
  onSearch?: (term: string) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  onBulkDelete?: (selectedIds: string[]) => void;
  selection?: boolean;
  isLoading?: boolean;
  isBulkDeleting?: boolean;
  isShowPagination?: boolean;
  pagination?: {
    totalItems?: number;
    totalPages?: number;
    pageNumber?: number;
    pageSize?: number;
  };
  onPageChange?: (pageNumber: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

export function DataTable<TData>({
  data,
  columns,
  searchPlaceholder = "Search...",
  showSearch = true,
  filters = [],
  className,
  onSearch,
  onFilterChange,
  onBulkDelete,
  selection = true,
  isLoading = false,
  isBulkDeleting = false,
  isShowPagination = true,
  pagination,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<TData>) {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const visibleColumns = React.useMemo(() => {
    return columns.filter((col) => {
      const meta = col.meta as ColumnMeta | undefined;
      if (isMobile && meta?.mobileHidden) return false;
      return true;
    });
  }, [columns, isMobile]);

  const table = useReactTable({
    data,
    columns: visibleColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: selection ? rowSelection : {},
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: selection ? setRowSelection : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelections = selectedRows.length > 0;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const updated = { ...filterValues, [key]: value };
    setFilterValues(updated);
    onFilterChange?.(updated);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilterValues({});
    onSearch?.("");
    onFilterChange?.({});
    setRowSelection({});
  };

  const handleDelete = () => {
    const selectedIds = selectedRows.map((row) => (row.original as any).id);
    onBulkDelete?.(selectedIds);
    setRowSelection({});
  };

  if (isMobile) {
    return (
      <div className="w-full">
        {/* Mobile Card View */}
        <div className="flex flex-col gap-3">
          {/* Search & Filters */}
          {showSearch && (
            <div className="flex flex-col gap-2 pb-3">
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                disabled={isLoading}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {filters.map(({ key, label, options }) => (
                  <Select
                    key={key}
                    value={filterValues[key] ?? ""}
                    disabled={isLoading}
                    onValueChange={(value) => handleFilterChange(key, value)}
                  >
                    <SelectTrigger className="flex-1 min-w-[140px]">
                      <SelectValue placeholder={label} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
                {(searchTerm || Object.keys(filterValues).length > 0) && (
                  <Button variant="ghost" size="sm" onClick={handleClear}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Bulk Delete */}
          {(selection && hasSelections) || isBulkDeleting ? (
            <Button
              disabled={isLoading || isBulkDeleting}
              variant="errorOutline"
              size="sm"
              onClick={handleDelete}
              className="mb-2"
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete ({selectedRows.length})
              {isBulkDeleting && <Loader className="ml-1 h-4 w-4 animate-spin" />}
            </Button>
          ) : null}

          {/* Card List */}
          {isLoading ? (
            <TableSkeleton columns={2} rows={10} />
          ) : data.length === 0 ? (
            <EmptyState title="No records found" description="" />
          ) : (
            <div className="flex flex-col gap-2">
              {table.getRowModel().rows.map((row) => (
                <MobileRow
                  key={row.id}
                  row={row}
                  columns={visibleColumns as ColumnDef<TData, any>[]}
                  onToggleSelect={() => row.toggleSelected()}
                  isSelected={row.getIsSelected()}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {isShowPagination && (
            <div className="mt-4">
              <DataTablePagination
                pageNumber={pagination?.pageNumber || 1}
                pageSize={pagination?.pageSize || 10}
                totalCount={pagination?.totalItems || 0}
                totalPages={pagination?.totalPages || 0}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Top Bar: Search & Filters */}
      <div className="flex flex-wrap justify-between items-center gap-2 pb-4">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {showSearch && (
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              disabled={isLoading}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-sm"
            />
          )}
          {filters.map(({ key, label, options }) => (
            <Select
              key={key}
              value={filterValues[key] ?? ""}
              disabled={isLoading}
              onValueChange={(value) => handleFilterChange(key, value)}
            >
              <SelectTrigger className="min-w-[160px]">
                <div className="flex items-center gap-2">
                  <PlusCircleIcon className="h-4 w-4 opacity-50" />
                  <SelectValue placeholder={label} />
                </div>
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {(searchTerm ||
            Object.keys(rowSelection).length > 0 ||
            Object.keys(filterValues).length > 0) && (
            <Button
              variant="ghost"
              disabled={isLoading || isBulkDeleting}
              onClick={handleClear}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>

        {(selection && hasSelections) || isBulkDeleting ? (
          <Button
            disabled={isLoading || isBulkDeleting}
            variant="errorOutline"
            size="sm"
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete ({selectedRows.length})
            {isBulkDeleting && <Loader className="ml-1 h-4 w-4 animate-spin" />}
          </Button>
        ) : null}
      </div>

      {/* Table */}
      <div className={cn("rounded-md border overflow-x-auto", className)}>
        {isLoading ? (
          <TableSkeleton columns={6} rows={20} />
        ) : (
          <Table
            className={cn(
              table.getRowModel().rows.length === 0 ? "h-[200px]" : ""
            )}
          >
            <TableHeader className="sticky top-0 bg-muted z-10 ">
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="!font-medium !text-[13px]"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="!text-[13.3px]">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center h-24"
                  >
                    <EmptyState title="No records found" description="" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {isShowPagination && (
        <div className="mt-4">
          <DataTablePagination
            pageNumber={pagination?.pageNumber || 1}
            pageSize={pagination?.pageSize || 10}
            totalCount={pagination?.totalItems || 0}
            totalPages={pagination?.totalPages || 0}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
}

function MobileRow<TData>({
  row,
  columns,
  onToggleSelect,
  isSelected,
}: {
  row: any;
  columns: ColumnDef<TData, any>[];
  onToggleSelect: () => void;
  isSelected: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3 cursor-pointer",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onToggleSelect}
    >
      <div className="flex items-center justify-between gap-2">
        {row.getVisibleCells().map((cell: any) => {
          const meta = cell.column.columnDef.meta as ColumnMeta | undefined;
          const value = flexRender(cell.column.columnDef.cell, cell.getContext());
          return (
            <div key={cell.id} className="flex-1 min-w-0">
              {meta?.mobileLabel && (
                <div className="text-xs text-muted-foreground">
                  {meta.mobileLabel}
                </div>
              )}
              <div className="text-sm truncate">{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}