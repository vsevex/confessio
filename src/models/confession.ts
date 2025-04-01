export interface Confession {
  user_id: number | undefined;
  text: string;
  is_anonymous: boolean;
  is_deleted: boolean;
  created_at: Date;
}
