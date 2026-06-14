import { pushArtifact } from "../lib/github.js";

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        const artifact = req.body;

        if (!artifact || !artifact.id) {
            return res.status(400).json({ error: "Invalid artifact" });
        }

        const result = await pushArtifact(artifact);

        return res.status(200).json({
            success: true,
            message: "Artifact saved to GitHub",
            github_url: result?.content?.html_url || null
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}
