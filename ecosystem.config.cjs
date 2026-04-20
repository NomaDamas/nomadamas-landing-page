// pm2 ecosystem for NomaDamas landing page.
// Serves ./public/index.html via http-server on 127.0.0.1:3030.
// The `public/` subdirectory layout exists so Cloudflare Pages can deploy
// only the frontend (public/) without ingesting node_modules, which would
// otherwise include a >25MiB workerd binary and fail the Pages build.

module.exports = {
  apps: [
    {
      name: "nomadamas-landing",
      cwd: "/Users/jeffrey/Projects/nomadamas-landing-page",
      // Pin the interpreter to the Homebrew node symlink.
      // Paths containing "node@" trigger pm2's nvm resolver (mis-reads as version tag),
      // so always use /opt/homebrew/bin/node which is a plain symlink.
      interpreter: "/opt/homebrew/bin/node",
      script: "./node_modules/http-server/bin/http-server",
      args: [
        "public",
        "-p", "3030",
        "-a", "127.0.0.1",
        "-c-1",
        "--cors",
        "-s",
      ],
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
