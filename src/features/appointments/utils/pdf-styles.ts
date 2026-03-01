/**
 * PDF styling constants and utilities
 */

import { PDF_CONSTANTS } from './constants';

export const PDF_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${PDF_CONSTANTS.PAGE_WIDTH}px;
    min-height: ${PDF_CONSTANTS.PAGE_HEIGHT}px;
    padding: ${PDF_CONSTANTS.PADDING};
    background-color: #ffffff;
    font-family: 'Times New Roman', Times, serif;
    color: ${PDF_CONSTANTS.DARK_TEXT};
    position: relative;
    line-height: 1.5;
  }
  .watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    background-image: url('__WATERMARK_URL__');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.08;
    pointer-events: none;
    z-index: 0;
  }
  .content { position: relative; z-index: 1; }
  .doc-header {
    border-bottom: 3px solid ${PDF_CONSTANTS.PRIMARY_COLOR};
    padding-bottom: 15px;
    margin-bottom: 20px;
  }
  .doc-title {
    font-size: 24px;
    font-weight: bold;
    color: ${PDF_CONSTANTS.PRIMARY_COLOR};
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 5px;
  }
  .doc-subtitle {
    font-size: 11px;
    color: ${PDF_CONSTANTS.LIGHT_TEXT};
    font-style: italic;
  }
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 20px;
    padding: 15px;
    background-color: ${PDF_CONSTANTS.LIGHT_BG};
    border: 1px solid ${PDF_CONSTANTS.SECONDARY_COLOR};
    border-radius: 4px;
    margin-bottom: 20px;
    font-size: 13px;
  }
  .info-label {
    font-weight: 600;
    color: #495057;
  }
  .info-value {
    color: #212529;
  }
  .section {
    margin-bottom: 20px;
    page-break-inside: avoid;
  }
  .section-title {
    font-size: 15px;
    font-weight: bold;
    color: ${PDF_CONSTANTS.PRIMARY_COLOR};
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 5px;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .section-content {
    padding: 10px;
    font-size: 13px;
    line-height: 1.6;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    font-size: 12px;
  }
  th {
    background-color: ${PDF_CONSTANTS.PRIMARY_COLOR};
    color: #ffffff;
    padding: 10px 8px;
    text-align: left;
    font-weight: 600;
    border: 1px solid ${PDF_CONSTANTS.PRIMARY_COLOR};
  }
  td {
    border: 1px solid ${PDF_CONSTANTS.SECONDARY_COLOR};
    padding: 8px;
    background-color: #ffffff;
  }
  tr:nth-child(even) td {
    background-color: ${PDF_CONSTANTS.LIGHT_BG};
  }
  td.right { text-align: right; }
  td.center { text-align: center; }
  .total-row {
    font-weight: bold;
    background-color: #e9ecef !important;
    font-size: 13px;
  }
  .signature-section {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid ${PDF_CONSTANTS.SECONDARY_COLOR};
  }
  .signature-box {
    display: inline-block;
    text-align: center;
    min-width: 200px;
    float: right;
  }
  .signature-line {
    border-top: 2px solid #000000;
    margin-top: 50px;
    padding-top: 5px;
    font-size: 12px;
    font-weight: 600;
  }
  .doctor-reg {
    font-size: 11px;
    color: ${PDF_CONSTANTS.LIGHT_TEXT};
    margin-top: 3px;
  }
  .footer {
    position: absolute;
    bottom: 30px;
    left: 40px;
    right: 40px;
    text-align: center;
    font-size: 10px;
    color: ${PDF_CONSTANTS.LIGHT_TEXT};
    border-top: 1px solid ${PDF_CONSTANTS.SECONDARY_COLOR};
    padding-top: 10px;
  }
  .rx-symbol {
    font-size: 28px;
    font-weight: bold;
    color: ${PDF_CONSTANTS.PRIMARY_COLOR};
    margin-right: 10px;
    vertical-align: middle;
  }
`;

/**
 * Creates PDF styles with watermark URL injection
 */
export const getPdfStylesWithWatermark = (watermarkUrl?: string): string => {
  if (!watermarkUrl) {
    return PDF_STYLES.replace('.watermark { display: none; }', '');
  }
  return PDF_STYLES.replace('__WATERMARK_URL__', watermarkUrl);
};

/**
 * HTML2Canvas configuration for PDF generation
 */
export const HTML2CANVAS_CONFIG = {
  scale: 2,
  useCORS: true,
  allowTaint: true,
  backgroundColor: '#ffffff',
  logging: false,
  windowWidth: PDF_CONSTANTS.PAGE_WIDTH,
  windowHeight: PDF_CONSTANTS.PAGE_HEIGHT,
} as const;

/**
 * jsPDF configuration for PDF creation
 */
export const JSPDF_CONFIG = {
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4',
} as const;

/**
 * Iframe configuration for PDF rendering
 */
export const IFRAME_STYLES = `
  position: absolute;
  left: -9999px;
  width: ${PDF_CONSTANTS.PAGE_WIDTH}px;
  height: ${PDF_CONSTANTS.PAGE_HEIGHT}px;
  border: none;
`;

/**
 * Delay for iframe rendering (ms)
 */
export const IFRAME_RENDER_DELAY = 300;
