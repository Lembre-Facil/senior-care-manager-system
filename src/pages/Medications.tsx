
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
import { MedicationsTable } from '@/components/tables/MedicationsTable';
import { MedicationForm } from '@/components/forms/MedicationForm';
import { useToast } from '@/hooks/use-toast';
import { Medication } from '@/types';
import { Plus, Pill } from 'lucide-react';
import { medications as initialMedications } from '@/data/mockData';

const Medications = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [selectedMedication, setSelectedMedication] = useState<Medication | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenForm = (medication?: Medication) => {
    setSelectedMedication(medication);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedMedication(undefined);
    setIsFormOpen(false);
  };

  const handleViewMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsViewOpen(true);
  };

  const handleDeleteMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMedication) {
      const newMedications = medications.filter(m => m.id !== selectedMedication.id);
      setMedications(newMedications);
      toast({
        title: "Medicação removida",
        description: `${selectedMedication.name} foi removido com sucesso.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedMedication(undefined);
    }
  };

  const handleSubmitMedication = (medication: Medication) => {
    if (selectedMedication) {
      // Update existing medication
      const updatedMedications = medications.map(m =>
        m.id === selectedMedication.id ? { ...medication, id: m.id } : m
      );
      setMedications(updatedMedications);
      toast({
        title: "Medicação atualizada",
        description: `${medication.name} foi atualizado com sucesso.`,
      });
    } else {
      // Add new medication
      setMedications([...medications, { ...medication, id: String(Date.now()) }]);
      toast({
        title: "Medicação adicionada",
        description: `${medication.name} foi adicionado com sucesso.`,
      });
    }
    handleCloseForm();
  };

  return (
    <DashboardLayout>
      <div className="care-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Medicações</h1>
            <p className="text-muted-foreground">
              Gerencie as medicações utilizadas pelos pacientes
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Medicação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedMedication ? 'Editar Medicação' : 'Adicionar Medicação'}
                </DialogTitle>
                <DialogDescription>
                  {selectedMedication
                    ? 'Edite os dados da medicação no formulário abaixo.'
                    : 'Preencha os dados da nova medicação no formulário abaixo.'}
                </DialogDescription>
              </DialogHeader>
              <MedicationForm
                medication={selectedMedication}
                onSubmit={handleSubmitMedication}
                onCancel={handleCloseForm}
              />
            </DialogContent>
          </Dialog>
        </div>

        <MedicationsTable
          medications={medications}
          onEdit={handleOpenForm}
          onDelete={handleDeleteMedication}
          onView={handleViewMedication}
        />

        {/* View Medication Details Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-xl">
            {selectedMedication && (
              <>
                <DialogHeader>
                  <DialogTitle>Detalhes da Medicação</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-full bg-green-50">
                      <Pill className="h-8 w-8 text-care-accent" />
                    </div>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedMedication.name}</CardTitle>
                      <CardDescription>Dosagem: {selectedMedication.dosage}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="font-medium mb-1">Descrição</div>
                          <p>
                            {selectedMedication.description || "Sem descrição disponível."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsViewOpen(false)}>Fechar</Button>
                  <Button onClick={() => {
                    setIsViewOpen(false);
                    handleOpenForm(selectedMedication);
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
                Tem certeza que deseja excluir a medicação {selectedMedication?.name}? Esta ação não pode ser desfeita.
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

export default Medications;
