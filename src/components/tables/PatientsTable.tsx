
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
import { Patient, SortDirection, TableColumn } from '@/types';
import { format } from 'date-fns';

interface PatientsTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  onView: (patient: Patient) => void;
}

export function PatientsTable({ patients, onEdit, onDelete, onView }: PatientsTableProps) {
  const [sortBy, setSortBy] = useState<keyof Patient>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: keyof Patient) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm) ||
    patient.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const columns: TableColumn<Patient>[] = [
    { key: 'name', header: 'Nome', sortable: true },
    { key: 'cpf', header: 'CPF', sortable: true },
    { 
      key: 'dateOfBirth', 
      header: 'Data de Nascimento', 
      sortable: true, 
      render: (patient) => format(new Date(patient.dateOfBirth), 'dd/MM/yyyy')
    },
    { key: 'city', header: 'Cidade', sortable: true },
    { key: 'contact', header: 'Contato', sortable: true },
    { 
      key: 'actions', 
      header: 'Ações',
      render: (patient) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onView(patient)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(patient)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(patient)}>
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
            placeholder="Buscar pacientes..."
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
                  onClick={() => column.sortable && handleSort(column.key as keyof Patient)}
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
            {sortedPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum paciente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              sortedPatients.map((patient) => (
                <TableRow key={patient.id}>
                  {columns.map((column) => (
                    <TableCell key={`${patient.id}-${column.key}`}>
                      {column.render
                        ? column.render(patient)
                        : patient[column.key as keyof Patient]?.toString()}
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
