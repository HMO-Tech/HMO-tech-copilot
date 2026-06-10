import { pushArtifact } from "../../lib/github.js";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const artifact = req.body;

  if (!artifact || !artifact.id) {
    return res.status(400).json({ error: "Artifact data required" });
  }

  try {
    // ۱. ذخیره محلی (optional)
    const dir = path.join(process.cwd(), "workflows");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, `artifact-${artifact.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(artifact, null, 2));

    // ۲. push به GitHub
    const githubRes = await pushArtifact(artifact);

    res.status(200).json({
      success: true,
      artifact,
      github: githubRes.html_url
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
