
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Patient, Disease } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { diseases } from '@/data/mockData';

const patientSchema = z.object({
  cpf: z.string().min(11, 'CPF deve ter pelo menos 11 caracteres'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  dateOfBirth: z.date({
    required_error: 'Data de nascimento é obrigatória',
  }),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  susCard: z.string().min(15, 'Cartão SUS deve ter pelo menos 15 caracteres'),
  contact: z.string().min(10, 'Contato deve ter pelo menos 10 caracteres'),
  medicalHistory: z.string().optional(),
  diseaseIds: z.array(z.string()).optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: Patient) => void;
  onCancel: () => void;
  compact?: boolean;
}

export function PatientForm({ patient, onSubmit, onCancel, compact = false }: PatientFormProps) {
  const [selectedDiseases, setSelectedDiseases] = useState<Disease[]>(
    patient?.diseases || []
  );

  // Initialize the form with existing patient data or defaults
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      cpf: patient?.cpf || '',
      name: patient?.name || '',
      dateOfBirth: patient ? new Date(patient.dateOfBirth) : undefined,
      city: patient?.city || '',
      susCard: patient?.susCard || '',
      contact: patient?.contact || '',
      medicalHistory: patient?.medicalHistory || '',
      diseaseIds: patient?.diseases.map(d => d.cid) || [],
    },
  });

  function handleFormSubmit(data: PatientFormValues) {
    const patientData: Patient = {
      id: patient?.id || String(Date.now()),
      cpf: data.cpf,
      name: data.name,
      dateOfBirth: data.dateOfBirth.toISOString().split('T')[0],
      city: data.city,
      susCard: data.susCard,
      contact: data.contact,
      medicalHistory: data.medicalHistory || '',
      diseases: selectedDiseases,
    };

    onSubmit(patientData);
  }

  const handleDiseaseSelect = (diseaseCid: string) => {
    const disease = diseases.find(d => d.cid === diseaseCid);
    if (!disease) return;

    if (selectedDiseases.some(d => d.cid === disease.cid)) {
      setSelectedDiseases(selectedDiseases.filter(d => d.cid !== disease.cid));
    } else {
      setSelectedDiseases([...selectedDiseases, disease]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className={`grid grid-cols-1 ${compact ? 'gap-3' : 'md:grid-cols-2 gap-6'}`}>
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={compact ? "text-sm" : ""}>CPF</FormLabel>
                <FormControl>
                  <Input placeholder="000.000.000-00" {...field} className={compact ? "h-8 text-sm" : ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={compact ? "text-sm" : ""}>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} className={compact ? "h-8 text-sm" : ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className={compact ? "text-sm" : ""}>Data de Nascimento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                          compact && "h-8 text-sm"
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
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={compact ? "text-sm" : ""}>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" {...field} className={compact ? "h-8 text-sm" : ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="susCard"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={compact ? "text-sm" : ""}>Cartão SUS</FormLabel>
                <FormControl>
                  <Input placeholder="Número do cartão SUS" {...field} className={compact ? "h-8 text-sm" : ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={compact ? "text-sm" : ""}>Contato</FormLabel>
                <FormControl>
                  <Input placeholder="Telefone ou email" {...field} className={compact ? "h-8 text-sm" : ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="medicalHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={compact ? "text-sm" : ""}>Histórico Médico</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o histórico médico do paciente"
                    className={compact ? "min-h-[80px] text-sm" : "min-h-[120px]"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Card className={compact ? "border-0 shadow-none" : ""}>
          <CardHeader className={compact ? "p-3" : ""}>
            <CardTitle className={compact ? "text-base" : ""}>Doenças</CardTitle>
            <CardDescription className={compact ? "text-xs" : ""}>
              Selecione as doenças associadas a este paciente.
            </CardDescription>
          </CardHeader>
          <CardContent className={compact ? "p-3 pt-0" : ""}>
            <div className={`grid grid-cols-1 gap-2 ${compact ? 'sm:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3 gap-3'}`}>
              {diseases.map((disease) => (
                <div 
                  key={disease.cid}
                  className={`p-2 rounded-lg border cursor-pointer ${compact ? 'text-sm' : 'p-3'} ${
                    selectedDiseases.some(d => d.cid === disease.cid) 
                      ? 'bg-care-light border-care-primary' 
                      : 'hover:bg-muted/30'
                  }`}
                  onClick={() => handleDiseaseSelect(disease.cid)}
                >
                  <div className={`font-medium ${compact ? 'text-sm' : ''}`}>{disease.name}</div>
                  <div className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>CID: {disease.cid}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} className={compact ? "h-8 text-sm" : ""}>
            Cancelar
          </Button>
          <Button type="submit" className={compact ? "h-8 text-sm" : ""}>
            {patient ? 'Atualizar Paciente' : 'Cadastrar Paciente'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
