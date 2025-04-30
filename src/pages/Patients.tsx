
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { PatientsTable } from '@/components/tables/PatientsTable';
import { PatientForm } from '@/components/forms/PatientForm';
import { useToast } from '@/hooks/use-toast';
import { Patient } from '@/types';
import { Plus } from 'lucide-react';
import { patients as initialPatients } from '@/data/mockData';
import { format } from 'date-fns';

const Patients = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenForm = (patient?: Patient) => {
    setSelectedPatient(patient);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedPatient(undefined);
    setIsFormOpen(false);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewOpen(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPatient) {
      const newPatients = patients.filter(p => p.id !== selectedPatient.id);
      setPatients(newPatients);
      toast({
        title: "Paciente removido",
        description: `${selectedPatient.name} foi removido com sucesso.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedPatient(undefined);
    }
  };

  const handleSubmitPatient = (patient: Patient) => {
    if (selectedPatient) {
      // Update existing patient
      const updatedPatients = patients.map(p =>
        p.id === selectedPatient.id ? { ...patient, id: p.id } : p
      );
      setPatients(updatedPatients);
      toast({
        title: "Paciente atualizado",
        description: `Os dados de ${patient.name} foram atualizados com sucesso.`,
      });
    } else {
      // Add new patient
      setPatients([...patients, { ...patient, id: String(Date.now()) }]);
      toast({
        title: "Paciente adicionado",
        description: `${patient.name} foi adicionado com sucesso.`,
      });
    }
    handleCloseForm();
  };

  return (
    <DashboardLayout>
      <div className="care-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Pacientes</h1>
            <p className="text-muted-foreground">
              Gerencie os pacientes do asilo
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedPatient ? 'Editar Paciente' : 'Adicionar Paciente'}
                </DialogTitle>
                <DialogDescription>
                  {selectedPatient
                    ? 'Edite os dados do paciente no formulário abaixo.'
                    : 'Preencha os dados do novo paciente no formulário abaixo.'}
                </DialogDescription>
              </DialogHeader>
              <PatientForm
                patient={selectedPatient}
                onSubmit={handleSubmitPatient}
                onCancel={handleCloseForm}
              />
            </DialogContent>
          </Dialog>
        </div>

        <PatientsTable
          patients={patients}
          onEdit={handleOpenForm}
          onDelete={handleDeletePatient}
          onView={handleViewPatient}
        />

        {/* View Patient Details Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-xl">
            {selectedPatient && (
              <>
                <DialogHeader>
                  <DialogTitle>Detalhes do Paciente</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedPatient.name}</CardTitle>
                      <CardDescription>Informações pessoais</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="text-sm text-muted-foreground">CPF</div>
                        <div>{selectedPatient.cpf}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Data de Nascimento</div>
                        <div>{format(new Date(selectedPatient.dateOfBirth), 'dd/MM/yyyy')}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Cidade</div>
                        <div>{selectedPatient.city}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Contato</div>
                        <div>{selectedPatient.contact}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Cartão SUS</div>
                        <div>{selectedPatient.susCard}</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Histórico Médico</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{selectedPatient.medicalHistory || "Nenhum histórico médico registrado."}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Doenças</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedPatient.diseases.length === 0 ? (
                        <p className="text-muted-foreground">Nenhuma doença registrada.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedPatient.diseases.map(disease => (
                            <div key={disease.cid} className="p-3 rounded-lg border">
                              <div className="font-medium">{disease.name}</div>
                              <div className="text-sm text-muted-foreground">CID: {disease.cid}</div>
                              <div className="text-sm mt-1">{disease.description}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsViewOpen(false)}>Fechar</Button>
                  <Button onClick={() => {
                    setIsViewOpen(false);
                    handleOpenForm(selectedPatient);
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
                Tem certeza que deseja excluir o paciente {selectedPatient?.name}? Esta ação não pode ser desfeita.
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

export default Patients;
