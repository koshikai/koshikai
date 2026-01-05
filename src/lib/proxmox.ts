import proxmoxApi from "proxmox-api";

// 自署名証明書（Self-signed certificate）を使用している場合の警告を抑制
if (process.env.PROXMOX_INSECURE === "true") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

let proxmox: ReturnType<typeof proxmoxApi> | null = null;

export function getProxmoxClient() {
  if (proxmox) return proxmox;

  const host = process.env.PROXMOX_HOST;
  const tokenID = process.env.PROXMOX_TOKEN_ID;
  const tokenSecret = process.env.PROXMOX_TOKEN_SECRET;
  const port = process.env.PROXMOX_PORT || "8006";

  if (!host || !tokenID || !tokenSecret) {
    throw new Error("Proxmox connection details are missing in environment variables.");
  }

  proxmox = proxmoxApi({
    host,
    tokenID,
    tokenSecret,
    port: parseInt(port, 10),
  });

  return proxmox;
}
