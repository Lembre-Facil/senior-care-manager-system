
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
import { CaregiversTable } from '@/components/tables/CaregiversTable';
import { CaregiverForm } from '@/components/forms/CaregiverForm';
import { useToast } from '@/hooks/use-toast';
import { Caregiver } from '@/types';
import { Plus, Users } from 'lucide-react';
import { caregivers as initialCaregivers } from '@/data/mockData';

const Caregivers = () => {
  const { toast } = useToast();
  const [caregivers, setCaregivers] = useState<Caregiver[]>(initialCaregivers);
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenForm = (caregiver?: Caregiver) => {
    setSelectedCaregiver(caregiver);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedCaregiver(undefined);
    setIsFormOpen(false);
  };

  const handleViewCaregiver = (caregiver: Caregiver) => {
    setSelectedCaregiver(caregiver);
    setIsViewOpen(true);
  };

  const handleDeleteCaregiver = (caregiver: Caregiver) => {
    setSelectedCaregiver(caregiver);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCaregiver) {
      const newCaregivers = caregivers.filter(c => c.cpf !== selectedCaregiver.cpf);
      setCaregivers(newCaregivers);
      toast({
        title: "Cuidador removido",
        description: `${selectedCaregiver.name} foi removido com sucesso.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedCaregiver(undefined);
    }
  };

  const handleSubmitCaregiver = (caregiver: Caregiver) => {
    if (selectedCaregiver) {
      // Update existing caregiver
      const updatedCaregivers = caregivers.map(c =>
        c.cpf === selectedCaregiver.cpf ? { ...caregiver, patients: c.patients } : c
      );
      setCaregivers(updatedCaregivers);
      toast({
        title: "Cuidador atualizado",
        description: `Os dados de ${caregiver.name} foram atualizados com sucesso.`,
      });
    } else {
      // Add new caregiver
      setCaregivers([...caregivers, caregiver]);
      toast({
        title: "Cuidador adicionado",
        description: `${caregiver.name} foi adicionado com sucesso.`,
      });
    }
    handleCloseForm();
  };

  return (
    <DashboardLayout>
      <div className="care-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Cuidadores</h1>
            <p className="text-muted-foreground">
              Gerencie os cuidadores do asilo
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Cuidador
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedCaregiver ? 'Editar Cuidador' : 'Adicionar Cuidador'}
                </DialogTitle>
                <DialogDescription>
                  {selectedCaregiver
                    ? 'Edite os dados do cuidador no formulário abaixo.'
                    : 'Preencha os dados do novo cuidador no formulário abaixo.'}
                </DialogDescription>
              </DialogHeader>
              <CaregiverForm
                caregiver={selectedCaregiver}
                onSubmit={handleSubmitCaregiver}
                onCancel={handleCloseForm}
              />
            </DialogContent>
          </Dialog>
        </div>

        <CaregiversTable
          caregivers={caregivers}
          onEdit={handleOpenForm}
          onDelete={handleDeleteCaregiver}
          onView={handleViewCaregiver}
        />

        {/* View Caregiver Details Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-xl">
            {selectedCaregiver && (
              <>
                <DialogHeader>
                  <DialogTitle>Detalhes do Cuidador</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-full bg-purple-50">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedCaregiver.name}</CardTitle>
                      <CardDescription>Informações pessoais</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="text-sm text-muted-foreground">CPF</div>
                        <div>{selectedCaregiver.cpf}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div>{selectedCaregiver.email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Contato</div>
                        <div>{selectedCaregiver.contact}</div>
                      </div>
                      <div className="col-span-1 sm:col-span-2">
                        <div className="text-sm text-muted-foreground">Endereço</div>
                        <div>{selectedCaregiver.address}</div>
                      </div>
                    </CardContent>
                  </Card>
                  {selectedCaregiver.patients && selectedCaregiver.patients.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Pacientes Atribuídos</CardTitle>
                        <CardDescription>
                          Pacientes sob cuidados de {selectedCaregiver.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedCaregiver.patients.map(patient => (
                            <div key={patient.id} className="p-3 border rounded-md">
                              <div className="font-medium">{patient.name}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                CPF: {patient.cpf} • Cidade: {patient.city}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Contato: {patient.contact}
                              </div>
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
                    handleOpenForm(selectedCaregiver);
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
                Tem certeza que deseja excluir o cuidador {selectedCaregiver?.name}? Esta ação não pode ser desfeita.
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

export default Caregivers;
