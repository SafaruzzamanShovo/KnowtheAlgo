import { ContentBlock } from '../types';

/**
 * Parses a raw markdown string into the structured ContentBlock[] format
 * expected by the Documentation viewer.
 */
export const parseMarkdownToBlocks = (markdown: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  const lines = markdown.split('\n');
  
  let currentBuffer: string[] = [];
  let currentType: 'text' | 'code' | 'note' = 'text';
  let codeLanguage = 'text';

  const flushBuffer = () => {
    if (currentBuffer.length > 0) {
      const value = currentBuffer.join('\n').trim();
      if (value) {
        blocks.push({
          type: currentType,
          value: value,
          language: currentType === 'code' ? codeLanguage : undefined
        });
      }
      currentBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle Headings
    if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
      flushBuffer();
      blocks.push({
        type: 'heading',
        value: line.replace(/^#+\s/, '')
      });
      currentType = 'text';
      continue;
    }

    // Handle Code Blocks
    if (line.trim().startsWith('```')) {
      if (currentType === 'code') {
        // End of code block
        flushBuffer();
        currentType = 'text';
      } else {
        // Start of code block
        flushBuffer();
        currentType = 'code';
        codeLanguage = line.trim().replace('```', '') || 'text';
      }
      continue;
    }

    // Handle Notes/Callouts
    if (line.trim().startsWith('> [!NOTE]') || line.trim().startsWith('> ')) {
      if (currentType !== 'note') {
        flushBuffer();
        currentType = 'note';
      }
      currentBuffer.push(line.replace(/^>\s?(\[!NOTE\])?/, '').trim());
      continue;
    }

    // If we were in a note but line doesn't start with >, end note
    if (currentType === 'note' && !line.trim().startsWith('>')) {
      flushBuffer();
      currentType = 'text';
    }

    currentBuffer.push(line);
  }

  flushBuffer();
  return blocks;
};

/**
 * Converts structured ContentBlock[] back to markdown string for editing.
 */
export const blocksToMarkdown = (blocks: ContentBlock[]): string => {
  if (!blocks) return '';
  
  return blocks.map(block => {
    switch (block.type) {
      case 'heading':
        return `## ${block.value}\n`;
      case 'code':
        return `\`\`\`${block.language || ''}\n${block.value}\n\`\`\`\n`;
      case 'note':
        return `> [!NOTE]\n> ${block.value}\n`;
      default:
        return `${block.value}\n`;
    }
  }).join('\n');
};
