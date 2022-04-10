export type Document = {
  id: string;
  user_id: string;
  created_at: string;
  title: string;
  description: string;
  filename: string;
  status: "pending" | "approved" | "rejected";
};

export type Topic = {
  id: string;
  name: string;
};

export type Unlock = {
  user_id: string;
};
