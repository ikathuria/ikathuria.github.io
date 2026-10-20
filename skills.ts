/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Shared skill vocabulary for the skill map (Dashboard → Skill map).
// Raw tech-stack tags from data.ts and public/project-graph.json map to canonical skills here,
// so "Gemini 2.5" and "Gemini" are one node. A tag missing from this table still shows on its
// project, but never becomes a node. Add new tags here when you add a project.

export type SkillCategory = 'language' | 'framework' | 'llm' | 'ml' | 'data' | 'cloud';

export interface Skill {
    id: string;
    label: string;
    category: SkillCategory;
}

export const categoryMeta: Record<SkillCategory, { label: string; color: string }> = {
    language: { label: 'Language', color: '#FFD84D' },
    framework: { label: 'Framework', color: '#A5B4FC' },
    llm: { label: 'LLMs and agents', color: '#C4A3F5' },
    ml: { label: 'ML', color: '#FF9B8A' },
    data: { label: 'Data store', color: '#6EE7A0' },
    cloud: { label: 'Cloud', color: '#B8F04A' },
};

export const skills: Skill[] = [
    { id: 'python', label: 'Python', category: 'language' },
    { id: 'typescript', label: 'TypeScript', category: 'language' },
    { id: 'react', label: 'React', category: 'framework' },
    { id: 'nextjs', label: 'Next.js', category: 'framework' },
    { id: 'vue', label: 'Vue', category: 'framework' },
    { id: 'fastapi', label: 'FastAPI', category: 'framework' },
    { id: 'flask', label: 'Flask', category: 'framework' },
    { id: 'expo', label: 'Expo', category: 'framework' },
    { id: 'langchain', label: 'LangChain', category: 'llm' },
    { id: 'gemini', label: 'Gemini', category: 'llm' },
    { id: 'claude', label: 'Claude', category: 'llm' },
    { id: 'gpt', label: 'OpenAI GPT', category: 'llm' },
    { id: 'llama', label: 'Llama', category: 'llm' },
    { id: 'mistral', label: 'Mistral', category: 'llm' },
    { id: 'agents', label: 'Agent frameworks', category: 'llm' },
    { id: 'tensorflow', label: 'TensorFlow', category: 'ml' },
    { id: 'sklearn', label: 'scikit-learn', category: 'ml' },
    { id: 'huggingface', label: 'Hugging Face', category: 'ml' },
    { id: 'nlp', label: 'NLP', category: 'ml' },
    { id: 'audio', label: 'Audio ML', category: 'ml' },
    { id: 'neo4j', label: 'Neo4j', category: 'data' },
    { id: 'postgres', label: 'Postgres', category: 'data' },
    { id: 'supabase', label: 'Supabase', category: 'data' },
    { id: 'mongodb', label: 'MongoDB', category: 'data' },
    { id: 'azure', label: 'Azure', category: 'cloud' },
    { id: 'gcp', label: 'Google Cloud', category: 'cloud' },
];

// Raw tag (lowercased) → canonical skill ids. One raw tag may count as several skills
// ("Supabase" is also Postgres). Only map what is true of the tag itself.
export const tagAliases: Record<string, string[]> = {
    python: ['python'],
    typescript: ['typescript'],
    react: ['react'],
    'react 19': ['react'],
    'next.js': ['nextjs', 'react'],
    'vue.js': ['vue'],
    fastapi: ['fastapi', 'python'],
    flask: ['flask', 'python'],
    expo: ['expo', 'react'],
    langchain: ['langchain'],
    gemini: ['gemini'],
    'gemini 2.5': ['gemini'],
    'gemini/gpt-4': ['gemini', 'gpt'],
    claude: ['claude'],
    'claude code': ['claude', 'agents'],
    'llama 3': ['llama'],
    'mistral devstral': ['mistral'],
    'google adk': ['agents', 'gemini'],
    'replit agent': ['agents'],
    keras: ['tensorflow'],
    tensorflow: ['tensorflow'],
    'scikit-learn': ['sklearn', 'python'],
    huggingface: ['huggingface'],
    'transformers.js': ['huggingface'],
    distilroberta: ['huggingface', 'nlp'],
    nltk: ['nlp', 'python'],
    librosa: ['audio', 'python'],
    'web audio api': ['audio'],
    neo4j: ['neo4j'],
    supabase: ['supabase', 'postgres'],
    'neon postgres': ['postgres'],
    mongodb: ['mongodb'],
    'azure ml studio': ['azure'],
    'cloud run': ['gcp'],
};

export function skillsForTags(tags: string[]): string[] {
    return Array.from(new Set(tags.flatMap((t) => tagAliases[t.trim().toLowerCase()] ?? [])));
}
