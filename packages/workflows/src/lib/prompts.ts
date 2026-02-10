/**
 * Type definitions for project analysis
 */

export interface ProjectAnalysis {
  title: string;
  description: string;
  techStack: string[];
  mainPurpose: string;
  keyFeatures: string[];
  architecture: string;
  codeHighlights: string[];
  technicalDecisions?: string[];
  challengesAndSolutions?: string[];
  bestPractices?: string[];
  potentialImprovements?: string[];
}
