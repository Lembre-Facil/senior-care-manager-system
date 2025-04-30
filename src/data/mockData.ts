
import { Patient, Disease, Appointment, Caregiver, Doctor, Reminder, Medication } from "../types";

// Mock diseases
export const diseases: Disease[] = [
  { cid: "E11", name: "Diabetes Mellitus tipo 2", description: "Doença metabólica caracterizada por hiperglicemia" },
  { cid: "I10", name: "Hipertensão Arterial Essencial", description: "Pressão arterial elevada sem causa identificável" },
  { cid: "J44", name: "DPOC", description: "Doença Pulmonar Obstrutiva Crônica" },
  { cid: "G30", name: "Doença de Alzheimer", description: "Doença neurodegenerativa progressiva" },
  { cid: "M17", name: "Artrose de joelho", description: "Desgaste da cartilagem articular do joelho" },
  { cid: "F32", name: "Transtorno depressivo", description: "Episódio depressivo" },
  { cid: "F41", name: "Transtorno de ansiedade", description: "Inclui transtorno de pânico, fobias e ansiedade generalizada" }
];

// Mock medications
export const medications: Medication[] = [
  { id: "1", name: "Metformina", dosage: "850mg", description: "Para controle da glicemia" },
  { id: "2", name: "Losartana", dosage: "50mg", description: "Anti-hipertensivo" },
  { id: "3", name: "Atenolol", dosage: "25mg", description: "Beta-bloqueador para controle da pressão arterial" },
  { id: "4", name: "Salmeterol", dosage: "50mcg", description: "Broncodilatador para DPOC" },
  { id: "5", name: "Donepezila", dosage: "10mg", description: "Para tratamento de Alzheimer" },
  { id: "6", name: "Paracetamol", dosage: "750mg", description: "Analgésico e antitérmico" },
  { id: "7", name: "Ibuprofeno", dosage: "600mg", description: "Anti-inflamatório" },
  { id: "8", name: "Sertralina", dosage: "50mg", description: "Antidepressivo" },
  { id: "9", name: "Fluoxetina", dosage: "20mg", description: "Antidepressivo ISRS" },
  { id: "10", name: "Omeprazol", dosage: "20mg", description: "Protetor gástrico" }
];

// Mock doctors
export const doctors: Doctor[] = [
  { crm: "CRM-12345", name: "Dr. Carlos Silva", specialty: "Cardiologia" },
  { crm: "CRM-23456", name: "Dra. Ana Oliveira", specialty: "Neurologia" },
  { crm: "CRM-34567", name: "Dr. Roberto Santos", specialty: "Geriatria" },
  { crm: "CRM-45678", name: "Dra. Patrícia Lima", specialty: "Psiquiatria" },
  { crm: "CRM-56789", name: "Dr. Marcos Almeida", specialty: "Ortopedia" }
];

// Mock caregivers
export const caregivers: Caregiver[] = [
  { cpf: "123.456.789-01", name: "Fernanda Gomes", contact: "(11) 98765-4321", address: "Av. Paulista, 1000" },
  { cpf: "234.567.890-12", name: "Ricardo Ferreira", contact: "(11) 97654-3210", address: "Rua Augusta, 500" },
  { cpf: "345.678.901-23", name: "Juliana Costa", contact: "(11) 96543-2109", address: "Rua Oscar Freire, 200" },
  { cpf: "456.789.012-34", name: "Antônio Pereira", contact: "(11) 95432-1098", address: "Av. Brigadeiro Faria Lima, 1500" },
  { cpf: "567.890.123-45", name: "Mariana Souza", contact: "(11) 94321-0987", address: "Rua dos Pinheiros, 300" }
];

// Mock reminders
export const reminders: Reminder[] = [
  { id: "1", dateTime: "2025-05-01T08:30", type: "Medicação", frequency: "Diária", observation: "Tomar com água" },
  { id: "2", dateTime: "2025-05-02T15:00", type: "Consulta", frequency: "Única", observation: "Levar exames" },
  { id: "3", dateTime: "2025-05-03T10:00", type: "Exame", frequency: "Única", observation: "Jejum de 8 horas" },
  { id: "4", dateTime: "2025-05-04T12:00", type: "Medicação", frequency: "Semanal", observation: "Tomar após almoço" },
  { id: "5", dateTime: "2025-05-05T18:00", type: "Fisioterapia", frequency: "Semanal", observation: "Exercícios para joelho" }
];

// Mock appointments
export const appointments: Appointment[] = [
  { 
    id: "1", 
    date: "2025-05-15T10:00", 
    specialty: "Cardiologia",
    doctorCRM: "CRM-12345",
    doctorName: "Dr. Carlos Silva",
    doctorSpecialty: "Cardiologia",
    patientCPF: "123.456.789-00",
    patientName: "Maria da Silva",
    caregiverCPF: "123.456.789-01",
    caregiverName: "Fernanda Gomes",
    reminders: [reminders[0], reminders[3]]
  },
  { 
    id: "2", 
    date: "2025-05-20T14:30", 
    specialty: "Neurologia",
    doctorCRM: "CRM-23456",
    doctorName: "Dra. Ana Oliveira",
    doctorSpecialty: "Neurologia",
    patientCPF: "234.567.890-00",
    patientName: "João Santos",
    caregiverCPF: "234.567.890-12",
    caregiverName: "Ricardo Ferreira",
    reminders: [reminders[1]]
  },
  { 
    id: "3", 
    date: "2025-05-25T09:15", 
    specialty: "Geriatria",
    doctorCRM: "CRM-34567",
    doctorName: "Dr. Roberto Santos",
    doctorSpecialty: "Geriatria",
    patientCPF: "345.678.901-00",
    patientName: "Antônio Oliveira",
    caregiverCPF: "345.678.901-23",
    caregiverName: "Juliana Costa",
    reminders: [reminders[2]]
  },
  { 
    id: "4", 
    date: "2025-06-02T11:00", 
    specialty: "Psiquiatria",
    doctorCRM: "CRM-45678",
    doctorName: "Dra. Patrícia Lima",
    doctorSpecialty: "Psiquiatria",
    patientCPF: "456.789.012-00",
    patientName: "Margarida Pereira",
    caregiverCPF: "456.789.012-34",
    caregiverName: "Antônio Pereira",
    reminders: [reminders[4]]
  },
  { 
    id: "5", 
    date: "2025-06-10T16:45", 
    specialty: "Ortopedia",
    doctorCRM: "CRM-56789",
    doctorName: "Dr. Marcos Almeida",
    doctorSpecialty: "Ortopedia",
    patientCPF: "567.890.123-00",
    patientName: "José Lima",
    caregiverCPF: "567.890.123-45",
    caregiverName: "Mariana Souza"
  }
];

// Mock patients
export const patients: Patient[] = [
  { 
    id: "1", 
    cpf: "123.456.789-00", 
    name: "Maria da Silva", 
    dateOfBirth: "1940-06-15", 
    city: "São Paulo", 
    susCard: "123456789012345", 
    contact: "(11) 98888-7777", 
    medicalHistory: "Histórico de hipertensão e diabetes", 
    diseases: [diseases[0], diseases[1]],
    appointments: [appointments[0]]
  },
  { 
    id: "2", 
    cpf: "234.567.890-00", 
    name: "João Santos", 
    dateOfBirth: "1935-03-22", 
    city: "Rio de Janeiro", 
    susCard: "234567890123456", 
    contact: "(21) 97777-6666", 
    medicalHistory: "Doença de Alzheimer em estágio inicial, hipertensão", 
    diseases: [diseases[1], diseases[3]],
    appointments: [appointments[1]]
  },
  { 
    id: "3", 
    cpf: "345.678.901-00", 
    name: "Antônio Oliveira", 
    dateOfBirth: "1942-11-10", 
    city: "Belo Horizonte", 
    susCard: "345678901234567", 
    contact: "(31) 96666-5555", 
    medicalHistory: "DPOC, ex-fumante, histórico de pneumonia", 
    diseases: [diseases[2]],
    appointments: [appointments[2]]
  },
  { 
    id: "4", 
    cpf: "456.789.012-00", 
    name: "Margarida Pereira", 
    dateOfBirth: "1938-09-05", 
    city: "Porto Alegre", 
    susCard: "456789012345678", 
    contact: "(51) 95555-4444", 
    medicalHistory: "Depressão, ansiedade, artrose", 
    diseases: [diseases[4], diseases[5], diseases[6]],
    appointments: [appointments[3]]
  },
  { 
    id: "5", 
    cpf: "567.890.123-00", 
    name: "José Lima", 
    dateOfBirth: "1945-05-20", 
    city: "Salvador", 
    susCard: "567890123456789", 
    contact: "(71) 94444-3333", 
    medicalHistory: "Artrose de joelho bilateral, hipertensão controlada", 
    diseases: [diseases[1], diseases[4]],
    appointments: [appointments[4]]
  }
];

// Update caregivers with patients reference
caregivers[0].patients = [patients[0]]; 
caregivers[1].patients = [patients[1]];
caregivers[2].patients = [patients[2]];
caregivers[3].patients = [patients[3]];
caregivers[4].patients = [patients[4]];

// Get stats for dashboard
export const getStats = () => {
  return {
    totalPatients: patients.length,
    totalAppointments: appointments.length,
    totalMedications: medications.length,
    totalCaregivers: caregivers.length,
    upcomingAppointments: appointments.filter(a => new Date(a.date) > new Date()).length,
    patientsWithDiseases: new Set(patients.flatMap(p => p.diseases.map(d => d.cid))).size,
  };
};
