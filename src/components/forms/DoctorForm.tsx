
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Doctor } from '@/types';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIsMobile } from '@/hooks/use-mobile';

interface DoctorFormProps {
  doctor?: Doctor | null;
  onSubmit: (data: Doctor) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  crm: z.string().min(1, "CRM é obrigatório"),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  specialty: z.string().min(1, "Especialidade é obrigatória")
});

export function DoctorForm({ doctor, onSubmit, onCancel }: DoctorFormProps) {
  const isMobile = useIsMobile();
  
  const form = useForm<Doctor>({
    resolver: zodResolver(formSchema),
    defaultValues: doctor || {
      crm: "",
      name: "",
      specialty: ""
    }
  });

  const handleSubmit = (data: Doctor) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="crm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CRM</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="00000-UF" 
                  readOnly={!!doctor}
                  className={doctor ? "bg-muted" : ""}
                />
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
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Dr. Nome do Médico" />
              </FormControl>
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
              <FormControl>
                <Input {...field} placeholder="Especialidade" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-3">
          <Button type="button" variant="outline" onClick={onCancel} size={isMobile ? "sm" : "default"}>
            Cancelar
          </Button>
          <Button type="submit" size={isMobile ? "sm" : "default"}>
            {doctor ? "Salvar alterações" : "Cadastrar médico"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
