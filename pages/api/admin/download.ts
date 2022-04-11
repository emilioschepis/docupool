import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user, token } = await supabase.auth.api.getUserByCookie(req);
  if (!user || !token) {
    return res.status(401).send("Unauthenticated");
  }

  // TODO: Use app metadata to grant admin rights
  if (
    user.email !== "emilio.schepis@gmail.com" &&
    user.email !== "federico.schepis@gmail.com"
  ) {
    return res
      .status(401)
      .json({ message: "This endpoint is reserved for admins" });
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY as string;

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ message: "Document id is missing." });
  }

  const { data, error } = await adminClient
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.warn(error);
    return res.status(500).json({ message: "An unknown error has occurred." });
  }

  const extension = data.filename.split(".")[1];

  const { data: file, error: downloadError } = await adminClient.storage
    .from("uploads")
    .download(`${data.user_id}/${data.id}/${data.filename}`);

  if (downloadError || !file) {
    console.warn(downloadError);
    return res.status(500).json({ message: "An unknown error has occurred." });
  }

  res.setHeader("Content-Type", file.type);
  res.setHeader("Content-Length", file.size);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${data.title} (Docupool).${extension}"`
  );

  const buffer = Buffer.from(await file.arrayBuffer());
  res.write(buffer, "binary");
  res.end();
}
