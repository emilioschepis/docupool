import {
  supabaseClient,
  withAuthRequired,
} from "@supabase/supabase-auth-helpers/nextjs";

export default withAuthRequired(async (req, res) => {
  const id = req.query.id as string;
  const type = req.query.type as string;

  if (!["pending", "public"].includes(type)) {
    return res
      .status(400)
      .json({ message: "Please specify the download type." });
  }

  const { token } = await supabaseClient.auth.api.getUserByCookie(req);
  supabaseClient.auth.setAuth(token!);

  const { data, error } = await supabaseClient
    .from(type === "pending" ? "pending_documents" : "public_documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(500).json({ message: "An unknown error has occurred." });
  }

  const { data: file, error: downloadError } = await supabaseClient.storage
    .from("uploads")
    .download(data.file_key.replace("uploads/", ""));

  if (downloadError || !file) {
    return res.status(500).json({ message: "An unknown error has occurred." });
  }

  res.setHeader("Content-Type", file.type);
  res.setHeader("Content-Length", file.size);
  res.setHeader("Content-Disposition", "attachment");

  const buffer = Buffer.from(await file.arrayBuffer());
  res.write(buffer, "binary");
  res.end();
});
