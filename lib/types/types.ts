export type Document = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  filename: string;
  status: "pending" | "approved" | "rejected";
};
