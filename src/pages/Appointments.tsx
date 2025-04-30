
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { AppointmentsTable } from '@/components/tables/AppointmentsTable';
import { AppointmentForm } from '@/components/forms/AppointmentForm';
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '@/types';
import { Plus, Calendar } from 'lucide-react';
import { appointments as initialAppointments } from '@/data/mockData';
import { format } from 'date-fns';

const Appointments = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenForm = (appointment?: Appointment) => {
    setSelectedAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedAppointment(undefined);
    setIsFormOpen(false);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsViewOpen(true);
  };

  const handleDeleteAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAppointment) {
      const newAppointments = appointments.filter(a => a.id !== selectedAppointment.id);
      setAppointments(newAppointments);
      toast({
        title: "Consulta removida",
        description: `A consulta foi removida com sucesso.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedAppointment(undefined);
    }
  };

  const handleSubmitAppointment = (appointment: Appointment) => {
    if (selectedAppointment) {
      // Update existing appointment
      const updatedAppointments = appointments.map(a =>
        a.id === selectedAppointment.id ? { ...appointment, id: a.id } : a
      );
      setAppointments(updatedAppointments);
      toast({
        title: "Consulta atualizada",
        description: `A consulta foi atualizada com sucesso.`,
      });
    } else {
      // Add new appointment
      setAppointments([...appointments, { ...appointment, id: String(Date.now()) }]);
      toast({
        title: "Consulta agendada",
        description: `Nova consulta agendada com sucesso.`,
      });
    }
    handleCloseForm();
  };

  return (
    <DashboardLayout>
      <div className="care-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Consultas</h1>
            <p className="text-muted-foreground">
              Gerencie as consultas médicas dos pacientes
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Consulta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedAppointment ? 'Editar Consulta' : 'Agendar Consulta'}
                </DialogTitle>
                <DialogDescription>
                  {selectedAppointment
                    ? 'Edite os dados da consulta no formulário abaixo.'
                    : 'Preencha os dados para agendar uma nova consulta.'}
                </DialogDescription>
              </DialogHeader>
              <AppointmentForm
                appointment={selectedAppointment}
                onSubmit={handleSubmitAppointment}
                onCancel={handleCloseForm}
              />
            </DialogContent>
          </Dialog>
        </div>

        <AppointmentsTable
          appointments={appointments}
          onEdit={handleOpenForm}
          onDelete={handleDeleteAppointment}
          onView={handleViewAppointment}
        />

        {/* View Appointment Details Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-xl">
            {selectedAppointment && (
              <>
                <DialogHeader>
                  <DialogTitle>Detalhes da Consulta</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-full bg-care-light">
                      <Calendar className="h-8 w-8 text-care-primary" />
                    </div>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações da Consulta</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Data</div>
                        <div>{format(new Date(selectedAppointment.date), 'dd/MM/yyyy')}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Hora</div>
                        <div>{format(new Date(selectedAppointment.date), 'HH:mm')}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Especialidade</div>
                        <div>{selectedAppointment.specialty}</div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Paciente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="font-medium">{selectedAppointment.patientName}</div>
                        <div className="text-sm text-muted-foreground">
                          CPF: {selectedAppointment.patientCPF}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Médico</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="font-medium">{selectedAppointment.doctorName}</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedAppointment.doctorSpecialty} - {selectedAppointment.doctorCRM}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Cuidador</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="font-medium">{selectedAppointment.caregiverName}</div>
                        <div className="text-sm text-muted-foreground">
                          CPF: {selectedAppointment.caregiverCPF}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  {selectedAppointment.reminders && selectedAppointment.reminders.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Lembretes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedAppointment.reminders.map(reminder => (
                            <div key={reminder.id} className="p-3 border rounded-md">
                              <div className="flex justify-between">
                                <div className="font-medium">{reminder.type}</div>
                                <div className="text-sm">{format(new Date(reminder.dateTime), 'dd/MM/yyyy HH:mm')}</div>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                Frequência: {reminder.frequency}
                              </div>
                              {reminder.observation && (
                                <div className="text-sm mt-2">{reminder.observation}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsViewOpen(false)}>Fechar</Button>
                  <Button onClick={() => {
                    setIsViewOpen(false);
                    handleOpenForm(selectedAppointment);
                  }}>Editar</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta consulta? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
