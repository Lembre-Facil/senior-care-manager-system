
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
import { Caregiver, SortDirection, TableColumn } from '@/types';

interface CaregiversTableProps {
  caregivers: Caregiver[];
  onEdit: (caregiver: Caregiver) => void;
  onDelete: (caregiver: Caregiver) => void;
  onView: (caregiver: Caregiver) => void;
}

export function CaregiversTable({ caregivers, onEdit, onDelete, onView }: CaregiversTableProps) {
  const [sortBy, setSortBy] = useState<keyof Caregiver>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: keyof Caregiver) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };

  const filteredCaregivers = caregivers.filter((caregiver) =>
    caregiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caregiver.cpf.includes(searchTerm) ||
    caregiver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caregiver.contact?.includes(searchTerm) ||
    caregiver.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCaregivers = [...filteredCaregivers].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const columns: TableColumn<Caregiver>[] = [
    { key: 'name', header: 'Nome', sortable: true },
    { key: 'cpf', header: 'CPF', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'contact', header: 'Contato', sortable: true },
    { key: 'address', header: 'Endereço', sortable: true },
    { 
      key: 'patients', 
      header: 'Pacientes', 
      render: (caregiver) => caregiver.patients?.length || 0
    },
    { 
      key: 'actions', 
      header: 'Ações',
      render: (caregiver) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onView(caregiver)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(caregiver)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(caregiver)}>
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
            placeholder="Buscar cuidadores..."
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
                  onClick={() => column.sortable && handleSort(column.key as keyof Caregiver)}
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
            {sortedCaregivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum cuidador encontrado.
                </TableCell>
              </TableRow>
            ) : (
              sortedCaregivers.map((caregiver) => (
                <TableRow key={caregiver.cpf}>
                  {columns.map((column) => (
                    <TableCell key={`${caregiver.cpf}-${column.key}`}>
                      {column.render
                        ? column.render(caregiver)
                        : caregiver[column.key as keyof Caregiver]?.toString()}
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
