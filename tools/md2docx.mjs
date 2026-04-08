// md2docx.mjs — Converts markdown essays to styled .docx files
// Usage: node tools/md2docx.mjs <input.md> <output.docx>

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, LevelFormat, PageBreak, ExternalHyperlink,
  BorderStyle, Header, Footer, PageNumber,
} = require("docx");
import fs from "fs";
import path from "path";

// ── Colors ──
const NAVY = "1a1a2e";
const BLUE = "141f52";
const MUTED = "59597a";

// ── Helpers ──
function parseInlineFormatting(text, baseOpts = {}) {
  const runs = [];
  // Regex handles **bold**, *italic*, and `code`
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      runs.push(new TextRun({ text: text.slice(lastIndex, match.index), ...baseOpts }));
    }
    if (match[2]) {
      // **bold**
      runs.push(new TextRun({ text: match[2], bold: true, ...baseOpts }));
    } else if (match[3]) {
      // *italic*
      runs.push(new TextRun({ text: match[3], italics: true, ...baseOpts }));
    } else if (match[4]) {
      // `code`
      runs.push(new TextRun({ text: match[4], font: "Consolas", size: 19, ...baseOpts }));
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    runs.push(new TextRun({ text: text.slice(lastIndex), ...baseOpts }));
  }
  if (runs.length === 0) {
    runs.push(new TextRun({ text, ...baseOpts }));
  }
  return runs;
}

function parseMarkdown(md) {
  const lines = md.split("\n");
  const children = [];
  let i = 0;

  // Numbering configs
  const bulletRef = "essayBullets";
  const numberRef = "essayNumbers";
  let numberCounter = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+\s*$/.test(line.trim())) {
      children.push(
        new Paragraph({
          spacing: { before: 200, after: 200 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "D0D0E0", space: 1 },
          },
          children: [],
        })
      );
      i++;
      continue;
    }

    // H1 title
    if (line.startsWith("# ") && !line.startsWith("## ")) {
      const text = line.replace(/^# /, "");
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 300 },
          children: [
            new TextRun({
              text,
              bold: true,
              font: "InterDisplay",
              size: 36,
              color: BLUE,
            }),
          ],
        })
      );
      i++;
      continue;
    }

    // H2 section header
    if (line.startsWith("## ")) {
      const text = line.replace(/^## /, "");
      children.push(
        new Paragraph({
          spacing: { before: 480, after: 60 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 4, color: "D0D0E0", space: 4 },
          },
          children: [
            new TextRun({
              text,
              bold: true,
              font: "InterDisplay",
              size: 26,
              color: BLUE,
            }),
          ],
        })
      );
      i++;
      continue;
    }

    // H3 subsection header
    if (line.startsWith("### ")) {
      const text = line.replace(/^### /, "");
      children.push(
        new Paragraph({
          spacing: { before: 360, after: 120 },
          children: [
            new TextRun({
              text,
              bold: true,
              font: "InterDisplay",
              size: 22,
              color: BLUE,
            }),
          ],
        })
      );
      i++;
      continue;
    }

    // Numbered list item
    const numMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      const content = numMatch[2];
      children.push(
        new Paragraph({
          numbering: { reference: numberRef, level: 0 },
          spacing: { before: 80, after: 80 },
          children: parseInlineFormatting(content, { font: "Inter", size: 20, color: NAVY }),
        })
      );
      i++;
      continue;
    }

    // Bullet list item (- or *)
    const bulletMatch = line.match(/^[-*]\s+(.+)/);
    if (bulletMatch) {
      const content = bulletMatch[1];
      children.push(
        new Paragraph({
          numbering: { reference: bulletRef, level: 0 },
          spacing: { before: 60, after: 60 },
          children: parseInlineFormatting(content, { font: "Inter", size: 20, color: NAVY }),
        })
      );
      i++;
      continue;
    }

    // Regular paragraph — collect continuation lines
    let paraText = line;
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("---") &&
      !lines[i].match(/^[-*]\s+/) &&
      !lines[i].match(/^\d+\.\s+/)
    ) {
      paraText += " " + lines[i].trim();
      i++;
    }

    children.push(
      new Paragraph({
        spacing: { before: 100, after: 100, line: 340 },
        children: parseInlineFormatting(paraText.trim(), { font: "Inter", size: 20, color: NAVY }),
      })
    );
  }

  return children;
}

async function convert(inputPath, outputPath) {
  const md = fs.readFileSync(inputPath, "utf-8");
  const content = parseMarkdown(md);

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Inter", size: 20, color: NAVY },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: "essayBullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "\u2022",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 720, hanging: 360 } },
                run: { color: BLUE },
              },
            },
          ],
        },
        {
          reference: "essayNumbers",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 720, hanging: 360 } },
                run: { color: BLUE },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1440, right: 1440, bottom: 1200, left: 1440 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "", font: "Inter", size: 16, color: MUTED }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ font: "Inter", size: 16, color: MUTED, children: [PageNumber.CURRENT] }),
                ],
              }),
            ],
          }),
        },
        children: content,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`DOCX saved: ${path.resolve(outputPath)}`);
}

// ── CLI ──
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node md2docx.mjs <input.md> <output.docx>");
  process.exit(1);
}
convert(args[0], args[1]);
