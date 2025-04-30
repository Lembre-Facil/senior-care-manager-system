
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Eye, Search } from 'lucide-react';
import { Medication, SortDirection, TableColumn } from '@/types';

interface MedicationsTableProps {
  medications: Medication[];
  onEdit: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
  onView: (medication: Medication) => void;
}

export function MedicationsTable({ medications, onEdit, onDelete, onView }: MedicationsTableProps) {
  const [sortBy, setSortBy] = useState<keyof Medication>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: keyof Medication) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };

  const filteredMedications = medications.filter((medication) =>
    medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.dosage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMedications = [...filteredMedications].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const columns: TableColumn<Medication>[] = [
    { key: 'name', header: 'Nome', sortable: true },
    { key: 'dosage', header: 'Dosagem', sortable: true },
    { key: 'description', header: 'Descrição', sortable: true },
    { 
      key: 'actions', 
      header: 'Ações',
      render: (medication) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onView(medication)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(medication)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(medication)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar medicações..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border table-container">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key.toString()} 
                  className={column.sortable ? 'cursor-pointer' : ''}
                  onClick={() => column.sortable && handleSort(column.key as keyof Medication)}
                >
                  {column.header}
                  {sortBy === column.key && (
                    <span className="ml-2">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMedications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhuma medicação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              sortedMedications.map((medication) => (
                <TableRow key={medication.id}>
                  {columns.map((column) => (
                    <TableCell key={`${medication.id}-${column.key}`}>
                      {column.render
                        ? column.render(medication)
                        : medication[column.key as keyof Medication]?.toString()}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
