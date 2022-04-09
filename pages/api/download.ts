import { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user, token } = await supabase.auth.api.getUserByCookie(req);
  if (!user || !token) {
    return res.status(401).send("Unauthenticated");
  }

  supabase.auth.setAuth(token);

  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ message: "Document id is missing." });
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.warn(error);
    return res.status(500).json({ message: "An unknown error has occurred." });
  }

  const { data: file, error: downloadError } = await supabase.storage
    .from("uploads")
    .download(`${data.user_id}/${data.id}/${data.filename}`);

  if (downloadError || !file) {
    console.warn(downloadError);
    return res.status(500).json({ message: "An unknown error has occurred." });
  }

  res.setHeader("Content-Type", file.type);
  res.setHeader("Content-Length", file.size);
  res.setHeader("Content-Disposition", "attachment");

  const buffer = Buffer.from(await file.arrayBuffer());
  res.write(buffer, "binary");
  res.end();
}
