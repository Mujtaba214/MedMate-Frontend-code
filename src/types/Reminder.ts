export interface Reminder {
  id: number;
  family_member_id?: number;
  prescription_id?: number;
  reminder_time: string;
  note?: string;
  email_sent?: boolean;
  created_at?: string;
  family_member_name?: string;
  medicine_name?: string;
}
