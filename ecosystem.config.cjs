// pm2 ecosystem for NomaDamas landing page.
// Serves ./index.html via http-server on 127.0.0.1:3030.
// Exposed to the internet as https://nomadamas.org through cloudflared
// (see ~/.cloudflared/config.yml + the `nomadamas-tunnel` pm2 entry).

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
        ".",
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
