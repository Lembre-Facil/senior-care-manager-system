
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Appointment, Patient, Caregiver, Doctor } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { doctors, patients, caregivers } from '@/data/mockData';

const appointmentSchema = z.object({
  date: z.date({
    required_error: 'Data é obrigatória',
  }),
  time: z.string({
    required_error: 'Hora é obrigatória',
  }),
  specialty: z.string().min(1, 'Especialidade é obrigatória'),
  doctorCRM: z.string().min(1, 'Médico é obrigatório'),
  patientCPF: z.string().min(1, 'Paciente é obrigatório'),
  caregiverCPF: z.string().min(1, 'Cuidador é obrigatório'),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  appointment?: Appointment;
  onSubmit: (data: Appointment) => void;
  onCancel: () => void;
}

export function AppointmentForm({ appointment, onSubmit, onCancel }: AppointmentFormProps) {
  // Pre-fill the form with appointment data if provided
  let defaultDate: Date | undefined;
  let defaultTime = '';

  if (appointment) {
    const appointmentDate = new Date(appointment.date);
    defaultDate = appointmentDate;
    defaultTime = format(appointmentDate, 'HH:mm');
  }

  // Specialties from doctors
  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: defaultDate,
      time: defaultTime,
      specialty: appointment?.specialty || '',
      doctorCRM: appointment?.doctorCRM || '',
      patientCPF: appointment?.patientCPF || '',
      caregiverCPF: appointment?.caregiverCPF || '',
    },
  });

  const selectedSpecialty = form.watch('specialty');
  
  // Filter doctors based on selected specialty
  const filteredDoctors = selectedSpecialty
    ? doctors.filter(doctor => doctor.specialty === selectedSpecialty)
    : doctors;

  function handleFormSubmit(data: AppointmentFormValues) {
    // Combine date and time
    const [hours, minutes] = data.time.split(':').map(Number);
    const dateTime = new Date(data.date);
    dateTime.setHours(hours, minutes);

    // Get selected doctor details
    const selectedDoctor = doctors.find(doctor => doctor.crm === data.doctorCRM);
    // Get selected patient details
    const selectedPatient = patients.find(patient => patient.cpf === data.patientCPF);
    // Get selected caregiver details
    const selectedCaregiver = caregivers.find(caregiver => caregiver.cpf === data.caregiverCPF);

    const appointmentData: Appointment = {
      id: appointment?.id || String(Date.now()),
      date: dateTime.toISOString(),
      specialty: data.specialty,
      doctorCRM: data.doctorCRM,
      doctorName: selectedDoctor?.name,
      doctorSpecialty: selectedDoctor?.specialty,
      patientCPF: data.patientCPF,
      patientName: selectedPatient?.name,
      caregiverCPF: data.caregiverCPF,
      caregiverName: selectedCaregiver?.name,
      reminders: appointment?.reminders || [],
    };

    onSubmit(appointmentData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora</FormLabel>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 opacity-50" />
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidade</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorCRM"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médico</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!selectedSpecialty}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !selectedSpecialty 
                          ? "Selecione uma especialidade primeiro" 
                          : "Selecione um médico"
                      } />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredDoctors.map((doctor) => (
                      <SelectItem key={doctor.crm} value={doctor.crm}>
                        {doctor.name} ({doctor.specialty})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patientCPF"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.cpf} value={patient.cpf}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="caregiverCPF"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuidador</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cuidador" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {caregivers.map((caregiver) => (
                      <SelectItem key={caregiver.cpf} value={caregiver.cpf}>
                        {caregiver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {appointment ? 'Atualizar Consulta' : 'Agendar Consulta'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
