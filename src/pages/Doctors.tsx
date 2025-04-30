
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { UserSquare, Plus } from 'lucide-react';
import { DoctorsTable } from '@/components/tables/DoctorsTable';
import { DoctorForm } from '@/components/forms/DoctorForm';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Doctor } from '@/types';

const Doctors = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const { toast } = useToast();

  // Simulate doctors data (this would come from API in a real app)
  const [doctors, setDoctors] = useState<Doctor[]>([
    { crm: "12345-SP", name: "Dr. Ana Silva", specialty: "Geriatria" },
    { crm: "67890-SP", name: "Dr. Carlos Oliveira", specialty: "Neurologia" },
    { crm: "54321-SP", name: "Dra. Marta Souza", specialty: "Cardiologia" },
    { crm: "98765-SP", name: "Dr. Roberto Santos", specialty: "Ortopedia" },
    { crm: "13579-SP", name: "Dra. Juliana Pereira", specialty: "Psiquiatria" }
  ]);

  const handleCreateDoctor = (data: Doctor) => {
    setDoctors((prev) => [...prev, data]);
    setIsDialogOpen(false);
    toast({
      title: "Médico cadastrado",
      description: `${data.name} foi adicionado(a) com sucesso.`
    });
  };

  const handleUpdateDoctor = (data: Doctor) => {
    setDoctors((prev) => 
      prev.map((doctor) => doctor.crm === data.crm ? data : doctor)
    );
    setSelectedDoctor(null);
    setIsDialogOpen(false);
    toast({
      title: "Médico atualizado",
      description: `Dados de ${data.name} foram atualizados com sucesso.`
    });
  };

  const handleDeleteDoctor = (crm: string) => {
    setDoctors((prev) => prev.filter((doctor) => doctor.crm !== crm));
    toast({
      title: "Médico removido",
      description: "O médico foi removido com sucesso."
    });
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedDoctor(null);
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <UserSquare className="h-6 w-6" />
              Médicos
            </h1>
            <p className="text-muted-foreground">
              Gerencie os médicos do sistema
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Médico
          </Button>
        </div>

        <DoctorsTable 
          doctors={doctors} 
          onEdit={handleEditDoctor} 
          onDelete={handleDeleteDoctor} 
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogTitle>
              {selectedDoctor ? "Editar Médico" : "Adicionar Médico"}
            </DialogTitle>
            <DoctorForm 
              doctor={selectedDoctor}
              onSubmit={selectedDoctor ? handleUpdateDoctor : handleCreateDoctor}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Doctors;
