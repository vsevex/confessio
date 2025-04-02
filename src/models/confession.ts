export interface Confession {
  ref_id: string | undefined;
  user_id: number | undefined;
  text: string;
  is_published: boolean;
  is_anonymous: boolean;
  is_deleted: boolean;
  created_at: Date;
}
