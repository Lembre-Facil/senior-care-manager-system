
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
import { Appointment, SortDirection, TableColumn } from '@/types';
import { format } from 'date-fns';

interface AppointmentsTableProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
  onView: (appointment: Appointment) => void;
}

export function AppointmentsTable({ appointments, onEdit, onDelete, onView }: AppointmentsTableProps) {
  const [sortBy, setSortBy] = useState<keyof Appointment>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: keyof Appointment) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const columns: TableColumn<Appointment>[] = [
    { 
      key: 'date', 
      header: 'Data', 
      sortable: true,
      render: (appointment) => format(new Date(appointment.date), 'dd/MM/yyyy HH:mm')
    },
    { key: 'specialty', header: 'Especialidade', sortable: true },
    { key: 'patientName', header: 'Paciente', sortable: true },
    { key: 'doctorName', header: 'Médico', sortable: true },
    { key: 'caregiverName', header: 'Cuidador', sortable: true },
    { 
      key: 'actions', 
      header: 'Ações',
      render: (appointment) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onView(appointment)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(appointment)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(appointment)}>
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
            placeholder="Buscar consultas..."
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
                  onClick={() => column.sortable && handleSort(column.key as keyof Appointment)}
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
            {sortedAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhuma consulta encontrada.
                </TableCell>
              </TableRow>
            ) : (
              sortedAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  {columns.map((column) => (
                    <TableCell key={`${appointment.id}-${column.key}`}>
                      {column.render
                        ? column.render(appointment)
                        : appointment[column.key as keyof Appointment]?.toString()}
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
