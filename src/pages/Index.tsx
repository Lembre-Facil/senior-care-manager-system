
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/StatsCard';
import { User, Calendar, Pill, Users, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getStats, appointments, patients } from '@/data/mockData';
import { format } from 'date-fns';

const Index = () => {
  const [stats, setStats] = useState(() => getStats());
  const navigate = useNavigate();
  
  // Get upcoming appointments (next 5)
  const upcomingAppointments = [...appointments]
    .filter(appointment => new Date(appointment.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="care-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel de Controle</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao LembreFácil - Sistema de gerenciamento de cuidados para idosos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Total de Pacientes" 
            value={stats.totalPatients} 
            icon={<User />}
            className="bg-care-light text-care-dark"
          />
          <StatsCard 
            title="Consultas Agendadas" 
            value={stats.upcomingAppointments} 
            icon={<Calendar />}
            className="bg-blue-50 text-blue-800"
          />
          <StatsCard 
            title="Medicamentos" 
            value={stats.totalMedications} 
            icon={<Pill />}
            className="bg-green-50 text-green-800"
          />
          <StatsCard 
            title="Cuidadores" 
            value={stats.totalCaregivers} 
            icon={<Users />}
            className="bg-purple-50 text-purple-800"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Próximas Consultas</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/appointments')}
                >
                  Ver todas
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Consultas agendadas para os próximos dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Não há consultas agendadas
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center p-3 rounded-lg border hover:bg-muted/30">
                      <div className="bg-care-light p-2 rounded-full mr-4">
                        <Clock className="h-5 w-5 text-care-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{appointment.patientName}</h4>
                        <div className="text-sm text-muted-foreground">
                          {appointment.specialty} com {appointment.doctorName}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{format(new Date(appointment.date), 'dd/MM/yyyy')}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(appointment.date), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pacientes Recentes</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/patients')}
                >
                  Ver todos
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Últimos pacientes cadastrados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.slice(0, 5).map((patient) => (
                  <div key={patient.id} className="flex items-center p-3 rounded-lg border hover:bg-muted/30">
                    <div className="bg-blue-50 p-2 rounded-full mr-4">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{patient.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        {patient.city} • {patient.contact}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium px-2 py-1 rounded-full bg-muted">
                        {patient.diseases.length} doenças
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
