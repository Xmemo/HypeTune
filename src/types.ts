export interface ModuleAnalysis {
  analysis: string;
  prompt: string;
  recommended_songs: string[];
}

export interface DeconstructionResult {
  search_context: {
    sources: string[];
    release_year: string;
    genres: string[];
  };
  modular_analysis: {
    harmony: ModuleAnalysis;
    rhythm: ModuleAnalysis;
    texture: ModuleAnalysis;
    arrangement: ModuleAnalysis;
  };
  expert_notes: string;
}
