import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const OWNER = "HMO-Tech";                  // نام حساب یا سازمان
const REPO = "D-T-Ai-Outputs";             // ریپازیتوری خروجی‌ها
const BRANCH = "main";                     // شاخه اصلی

export async function pushArtifact(artifact) {
  try {
    const path = `workflows/artifact-${artifact.id}.json`;
    const content = Buffer.from(JSON.stringify(artifact, null, 2)).toString("base64");

    // چک می‌کنیم فایل موجود هست یا نه
    let sha;
    try {
      const res = await octokit.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path,
        ref: BRANCH
      });
      sha = res.data.sha;
    } catch (e) {
      // فایل وجود نداشت → SHA = undefined
      sha = undefined;
    }

    const commit = await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path,
      message: `Add artifact ${artifact.id} at ${artifact.timestamp}`,
      content,
      branch: BRANCH,
      sha
    });

    return commit.data;
  } catch (err) {
    console.error("GitHub push failed:", err.message);
    throw err;
  }
}
