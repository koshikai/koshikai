"use server";

import { getProxmoxClient } from "@/lib/proxmox";
import { auth } from "@/auth";

export async function getNodes() {
  const session = await auth();
  if (!session) return [];

  try {
    const proxmox = getProxmoxClient();
    return await proxmox.nodes.$get();
  } catch (error) {
    console.error("Failed to fetch Proxmox nodes:", error);
    return [];
  }
}

export async function getResources() {
  const session = await auth();
  if (!session) return [];

  try {
    const proxmox = getProxmoxClient();
    return await proxmox.cluster.resources.$get();
  } catch (error) {
    console.error("Failed to fetch Proxmox resources:", error);
    return [];
  }
}

export async function getClusterStatistics() {
  try {
    const resources = await getResources();
    
    const vms = resources.filter(r => r.type === "qemu");
    const containers = resources.filter(r => r.type === "lxc");
    const nodes = resources.filter(r => r.type === "node");

    return {
      vmCount: vms.length,
      containerCount: containers.length,
      nodeCount: nodes.length,
      onlineNodes: nodes.filter(n => n.status === "online").length,
      runningVms: vms.filter(v => v.status === "running").length,
      runningContainers: containers.filter(c => c.status === "running").length,
    };
  } catch (error) {
    console.error("Failed to calculate cluster statistics:", error);
    return {
      vmCount: 0,
      containerCount: 0,
      nodeCount: 0,
      onlineNodes: 0,
      runningVms: 0,
      runningContainers: 0,
    };
  }
}
