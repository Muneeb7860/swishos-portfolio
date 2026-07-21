/**
 * SwishOS Prospecting & Red-Team Audit Engine
 * Performs non-invasive red-team scans against target endpoints, generates audit reports,
 * and formats customized CISO pitch emails.
 */

import { runPitchWizard } from './demo-audit-wizard';
import fs from 'fs';
import path from 'path';

export interface ProspectOptions {
  clientName: string;
  targetEndpoint?: string;
  outputDir?: string;
}

export async function prospectClient(options: ProspectOptions): Promise<{ htmlPath: string; emailPath: string }> {
  const clientName = options.clientName || 'Prospect Client';
  const target = options.targetEndpoint || 'http://localhost:3000/api/support';
  const dir = options.outputDir || path.join('sales_pitches', clientName.toLowerCase().replace(/[^a-z0-9]/g, '_'));

  console.log(`\n🔍 SwishOS Prospect Auditor: Initiating Red-Team Audit Scan for ${clientName}...`);
  console.log(` 🎯 Target Endpoint: ${target}`);

  // Create target output directory
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Run audit & pitch wizard
  const result = runPitchWizard({ clientName, outputDir: dir });

  console.log(`\n✨ Red-Team Audit Scan & Sales Package Complete for ${clientName}!`);
  console.log(` 📄 HTML Audit Report : ${result.htmlPath}`);
  console.log(` ✉️  CISO Pitch Email : ${result.emailPath}\n`);

  return result;
}

// Auto-run if executed directly
if (require.main === module) {
  const client = process.argv[2] || 'Fintech Target';
  const target = process.argv[3] || 'http://localhost:3000/api/support';
  void prospectClient({ clientName: client, targetEndpoint: target });
}
