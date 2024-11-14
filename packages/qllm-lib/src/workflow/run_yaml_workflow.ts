import { WorkflowManager } from "./workflow-manager";
import { getLLMProvider } from "../providers";
import { WorkflowStep, WorkflowExecutionResult } from "../types/workflow-types";
import path from 'path';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

async function main(): Promise<void> {
  // Créer les providers
  const providers = {
    openai: await getLLMProvider("openai")
  };

  // Initialiser le workflow manager
  const workflowManager = new WorkflowManager(providers);

  try {
    // Charger le workflow depuis le fichier YAML
    const workflowPath = path.join(__dirname, 'ai_research_workflow.yaml');
    await workflowManager.loadWorkflow(workflowPath);
    console.log("\n✅ Workflow YAML chargé avec succès");

    // Définir les entrées du workflow
    const workflowInput = {
      subject: "TypeScript",
      number_words: "1500",
      additional_requirements: "Focus on practical applications and modern development practices",
      source_language: "English",
      target_language: "French",
    };

    // Exécuter le workflow avec suivi de progression
    const result = await workflowManager.runWorkflow(
      "ai_research_workflow",
      workflowInput,
      {
        onStepStart: (step: WorkflowStep, index: number) => {
          console.log(`\n🔍 Démarrage de l'étape ${index + 1}: ${step.template.name}`);
        },
        onStepComplete: (step: WorkflowStep, index: number, result: WorkflowExecutionResult) => {
          console.log(`\n✅ Étape ${index + 1} terminée: ${step.template.name}`);
          console.log(`Résultat de l'étape ${index + 1}:`, result);
        },
        onStreamChunk: (chunk: string) => {
          process.stdout.write(chunk);
        }
      }
    );

    console.log("\n🎉 Workflow terminé avec succès");
    console.log("\nRésultats finaux:", JSON.stringify(result, null, 2));

  } catch (error) {
    console.error("\n❌ Erreur:", error);
    throw error;
  }
}

// Exécuter la fonction principale
if (require.main === module) {
  main().catch((error) => {
    console.error("\n💥 Erreur fatale:", error);
    process.exit(1);
  });
}