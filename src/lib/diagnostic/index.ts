export { runDiagnostic, calculateSetupScore, calculateExposureIndex, classifySegment, getTriggeredTraps, getRecommendations, getRulesetVersion, SEGMENT_MESSAGES } from './engine';
export { diagnosticQuestions, getActiveQuestions, DIAGNOSTIC_VERSION } from './questions';
export { PortugalTrapRules, RULESET_VERSION } from './rules/portugal';
export type { DiagnosticQuestion, DiagnosticAnswers, DiagnosticResult, DiagnosticSegment, DiagnosticSubmission, TrapRule, TriggeredTrap, TrapSeverity } from './types';
