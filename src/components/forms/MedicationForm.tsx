
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Medication } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const medicationSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  dosage: z.string().min(1, 'Dosagem é obrigatória'),
  description: z.string().optional(),
});

type MedicationFormValues = z.infer<typeof medicationSchema>;

interface MedicationFormProps {
  medication?: Medication;
  onSubmit: (data: Medication) => void;
  onCancel: () => void;
}

export function MedicationForm({ medication, onSubmit, onCancel }: MedicationFormProps) {
  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: medication?.name || '',
      dosage: medication?.dosage || '',
      description: medication?.description || '',
    },
  });

  function handleFormSubmit(data: MedicationFormValues) {
    const medicationData: Medication = {
      id: medication?.id || String(Date.now()),
      name: data.name,
      dosage: data.dosage,
      description: data.description,
    };

    onSubmit(medicationData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do medicamento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosagem</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 500mg, 10ml, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva detalhes sobre o medicamento"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {medication ? 'Atualizar Medicação' : 'Cadastrar Medicação'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
