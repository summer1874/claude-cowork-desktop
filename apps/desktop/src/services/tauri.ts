export type AppHealth = {
  version: string;
  ok: boolean;
};

export async function getAppHealth(): Promise<AppHealth> {
  // In browser-only mode (vite dev without tauri), return fallback.
  if (!(window as any).__TAURI_INTERNALS__) {
    return { version: 'web-dev', ok: true };
  }

  const { invoke } = await import('@tauri-apps/api/core');
  return invoke<AppHealth>('app_health');
}
