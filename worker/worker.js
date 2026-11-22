// Cloudflare Worker: receives the "Have a project?" form and posts it to Discord.
// In Cloudflare (Workers > your worker > Settings > Variables and Secrets) add:
//   DISCORD_WEBHOOK  (Secret)  your Discord webhook URL
//   ALLOWED_ORIGIN   (Text)    https://acedenide.vercel.app   (no trailing slash)

const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u0009\u000b-\u001f]/g, " ").trim().slice(0, max);

export default {
  async fetch(request, env) {
    const allowed = env.ALLOWED_ORIGIN || "";
    const cors = {
      "Access-Control-Allow-Origin": allowed || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };
    const reply = (obj, status = 200) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, "Content-Type": "application/json" } });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return reply({ ok: false, error: "Method not allowed" }, 405);
    if (!env.DISCORD_WEBHOOK) return reply({ ok: false, error: "Not configured" }, 500);

    // Only accept requests coming from your own site
    if (allowed && request.headers.get("Origin") !== allowed) return reply({ ok: false, error: "Forbidden" }, 403);

    let data;
    try {
      data = await request.json();
    } catch {
      return reply({ ok: false, error: "Bad request" }, 400);
    }

    // Honeypot: real visitors never fill this hidden field, bots do
    if (data.website) return reply({ ok: true });

    const name = clean(data.name, 100);
    const reach = clean(data.reach, 150);
    const reason = clean(data.reason, 60);
    const date = clean(data.date, 20);
    const budget = clean(data.budget, 80);
    const note = clean(data.note, 1800);

    if (!name || !reach) return reply({ ok: false, error: "Name and phone or email are required" }, 422);

    const fields = [
      { name: "Name", value: name, inline: true },
      { name: "Phone / Email", value: reach, inline: true },
    ];
    if (reason) fields.push({ name: "Wants to", value: reason, inline: true });
    if (date) fields.push({ name: "Target date", value: date, inline: true });
    if (budget) fields.push({ name: "Budget", value: budget, inline: true });

    const res = await fetch(env.DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "AceDenide Leads",
        allowed_mentions: { parse: [] }, // visitor text can never ping @everyone
        embeds: [{
          title: "New enquiry from the website",
          description: note || "(no project details)",
          color: 0xe30613,
          fields,
          timestamp: new Date().toISOString(),
        }],
      }),
    });

    if (!res.ok) return reply({ ok: false, error: "Could not send" }, 502);
    return reply({ ok: true });
  },
};
