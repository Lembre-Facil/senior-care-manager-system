
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Caregiver } from '@/types';
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

const caregiverSchema = z.object({
  cpf: z.string().min(11, 'CPF deve ter pelo menos 11 caracteres'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  contact: z.string().min(10, 'Contato deve ter pelo menos 10 caracteres'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
});

type CaregiverFormValues = z.infer<typeof caregiverSchema>;

interface CaregiverFormProps {
  caregiver?: Caregiver;
  onSubmit: (data: Caregiver) => void;
  onCancel: () => void;
}

export function CaregiverForm({ caregiver, onSubmit, onCancel }: CaregiverFormProps) {
  const form = useForm<CaregiverFormValues>({
    resolver: zodResolver(caregiverSchema),
    defaultValues: {
      cpf: caregiver?.cpf || '',
      name: caregiver?.name || '',
      contact: caregiver?.contact || '',
      address: caregiver?.address || '',
    },
  });

  function handleFormSubmit(data: CaregiverFormValues) {
    const caregiverData: Caregiver = {
      cpf: data.cpf,
      name: data.name,
      contact: data.contact,
      address: data.address,
      patients: caregiver?.patients || [],
    };

    onSubmit(caregiverData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input placeholder="000.000.000-00" {...field} />
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
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
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
                <FormLabel>Contato</FormLabel>
                <FormControl>
                  <Input placeholder="Telefone ou email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Endereço completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {caregiver ? 'Atualizar Cuidador' : 'Cadastrar Cuidador'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
