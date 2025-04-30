
export interface Patient {
  id: string;
  cpf: string;
  name: string;
  dateOfBirth: string;
  city: string;
  susCard: string;
  contact: string;
  medicalHistory: string;
  diseases: Disease[];
  appointments?: Appointment[];
}

export interface Disease {
  cid: string;
  name: string;
  description: string;
}

export interface Appointment {
  id: string;
  date: string;
  specialty: string;
  doctorCRM?: string;
  doctorName?: string;
  doctorSpecialty?: string;
  patientCPF?: string;
  patientName?: string;
  caregiverCPF?: string;
  caregiverName?: string;
  reminders?: Reminder[];
}

export interface Caregiver {
  cpf: string;
  name: string;
  contact?: string;
  address?: string;
  patients?: Patient[];
}

export interface Doctor {
  crm: string;
  name: string;
  specialty: string;
}

export interface Reminder {
  id: string;
  dateTime: string;
  type: string;
  frequency: string;
  observation?: string;
  appointmentId?: string;
  medications?: Medication[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  description?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}
